import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  private toNumber(value: unknown, fallback = 0): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  private round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  private async generateInvoiceNumber(): Promise<string> {
    const count = await this.prisma.invoice.count();
    const nextNumber = count + 1;
    return `VOW-INV-${String(nextNumber).padStart(5, '0')}`;
  }

  private buildInvoiceAmounts(params: {
    serviceAmount?: number;
    additionalCharges?: number;
    additionalChargeReason?: string | null;
    discountAmount?: number;
    gstPercentage?: number;
    paidAmount?: number;
  }) {
    const serviceAmount = this.toNumber(params.serviceAmount, 0);
    const additionalCharges = this.toNumber(params.additionalCharges, 0);
    const discountAmount = this.toNumber(params.discountAmount, 0);
    const gstPercentage = this.toNumber(params.gstPercentage, 18);
    const paidAmount = this.toNumber(params.paidAmount, 0);

    const taxableAmountRaw = serviceAmount + additionalCharges - discountAmount;

    const taxableAmount = this.round2(Math.max(0, taxableAmountRaw));
    const gstAmount = this.round2((taxableAmount * gstPercentage) / 100);
    const totalAmount = this.round2(taxableAmount + gstAmount);
    const dueAmount = this.round2(Math.max(0, totalAmount - paidAmount));

    return {
      serviceAmount: this.round2(serviceAmount),
      additionalCharges: this.round2(additionalCharges),
      additionalChargeReason: params.additionalChargeReason || null,
      discountAmount: this.round2(discountAmount),
      taxableAmount,
      gstPercentage: this.round2(gstPercentage),
      gstAmount,
      totalAmount,
      paidAmount: this.round2(paidAmount),
      dueAmount,
    };
  }

  async createOrUpdateByJobCard(createInvoiceDto: CreateInvoiceDto) {
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { jobCardId: createInvoiceDto.jobCardId },
    });

    if (existingInvoice) {
      return this.update(existingInvoice.id, {
        invoiceNumber: createInvoiceDto.invoiceNumber,
        serviceAmount: createInvoiceDto.serviceAmount,
        additionalCharges: createInvoiceDto.additionalCharges,
        additionalChargeReason: createInvoiceDto.additionalChargeReason,
        discountAmount: createInvoiceDto.discountAmount,
        taxableAmount: createInvoiceDto.taxableAmount,
        gstPercentage: createInvoiceDto.gstPercentage,
        gstAmount: createInvoiceDto.gstAmount,
        totalAmount: createInvoiceDto.totalAmount,
        paidAmount: createInvoiceDto.paidAmount,
        dueAmount: createInvoiceDto.dueAmount,
        gstin: createInvoiceDto.gstin,
        notes: createInvoiceDto.notes,
      });
    }

    return this.create(createInvoiceDto);
  }

  async create(createInvoiceDto: CreateInvoiceDto) {
    const jobCard = await this.prisma.jobCard.findUnique({
      where: { id: createInvoiceDto.jobCardId },
      include: {
        booking: {
          include: {
            serviceCenter: true,
          },
        },
      },
    });

    if (!jobCard) {
      throw new NotFoundException('Job card not found');
    }

    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { jobCardId: createInvoiceDto.jobCardId },
    });

    if (existingInvoice) {
      throw new BadRequestException('Invoice already exists for this job card');
    }

    const serviceAmount =
      createInvoiceDto.serviceAmount ??
      jobCard.finalAmount ??
      jobCard.labourAmount ??
      jobCard.estimatedAmount ??
      0;

    const additionalCharges =
      createInvoiceDto.additionalCharges ?? jobCard.additionalCharges ?? 0;

    const billing = this.buildInvoiceAmounts({
      serviceAmount,
      additionalCharges,
      additionalChargeReason:
        createInvoiceDto.additionalChargeReason ??
        jobCard.additionalChargeReason ??
        null,
      discountAmount: createInvoiceDto.discountAmount ?? 0,
      gstPercentage: createInvoiceDto.gstPercentage ?? 18,
      paidAmount: createInvoiceDto.paidAmount ?? 0,
    });

    return this.prisma.invoice.create({
      data: {
        jobCardId: createInvoiceDto.jobCardId,
        invoiceNumber:
          createInvoiceDto.invoiceNumber ||
          (await this.generateInvoiceNumber()),
        serviceAmount: billing.serviceAmount,
        additionalCharges: billing.additionalCharges,
        additionalChargeReason: billing.additionalChargeReason,
        discountAmount: billing.discountAmount,
        taxableAmount: billing.taxableAmount,
        gstPercentage: billing.gstPercentage,
        gstAmount: billing.gstAmount,
        totalAmount: billing.totalAmount,
        paidAmount: billing.paidAmount,
        dueAmount: billing.dueAmount,
        gstin: createInvoiceDto.gstin || null,
        notes: createInvoiceDto.notes || null,
      },
      include: {
        jobCard: {
          include: {
            booking: {
              include: {
                serviceCenter: true,
              },
            },
          },
        },
        paymentTransactions: true,
      },
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        jobCard: {
          include: {
            booking: {
              include: {
                serviceCenter: true,
              },
            },
          },
        },
        paymentTransactions: true,
      },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        jobCard: {
          include: {
            booking: {
              include: {
                serviceCenter: true,
              },
            },
          },
        },
        paymentTransactions: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async findLatestByCustomer(customerPhone: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        jobCard: {
          booking: {
            customerPhone,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          orderBy: {
            slNo: 'asc',
          },
        },
        jobCard: {
          include: {
            booking: {
              include: {
                serviceCenter: true,
                vehicle: true,
              },
            },
          },
        },
        paymentTransactions: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found for this customer');
    }

    return invoice;
  }

  async findAllByCustomer(customerPhone: string) {
    return this.prisma.invoice.findMany({
      where: {
        jobCard: {
          booking: {
            customerPhone,
          },
        },
      },
      include: {
        items: true,
        jobCard: {
          include: {
            booking: {
              include: {
                vehicle: true,
                serviceCenter: true,
              },
            },
          },
        },
        paymentTransactions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByJobCard(jobCardId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { jobCardId },
      include: {
        jobCard: {
          include: {
            booking: {
              include: {
                serviceCenter: true,
              },
            },
          },
        },
        paymentTransactions: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found for this job card');
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        jobCard: true,
      },
    });

    if (!existingInvoice) {
      throw new NotFoundException('Invoice not found');
    }

    const serviceAmount =
      updateInvoiceDto.serviceAmount ??
      existingInvoice.serviceAmount ??
      existingInvoice.jobCard.finalAmount ??
      existingInvoice.jobCard.labourAmount ??
      existingInvoice.jobCard.estimatedAmount ??
      0;

    const additionalCharges =
      updateInvoiceDto.additionalCharges ??
      existingInvoice.additionalCharges ??
      existingInvoice.jobCard.additionalCharges ??
      0;

    const billing = this.buildInvoiceAmounts({
      serviceAmount,
      additionalCharges,
      additionalChargeReason:
        updateInvoiceDto.additionalChargeReason ??
        existingInvoice.additionalChargeReason ??
        existingInvoice.jobCard.additionalChargeReason ??
        null,
      discountAmount:
        updateInvoiceDto.discountAmount ?? existingInvoice.discountAmount ?? 0,
      gstPercentage:
        updateInvoiceDto.gstPercentage ?? existingInvoice.gstPercentage ?? 18,
      paidAmount:
        updateInvoiceDto.paidAmount ?? existingInvoice.paidAmount ?? 0,
    });

    return this.prisma.invoice.update({
      where: { id },
      data: {
        invoiceNumber:
          updateInvoiceDto.invoiceNumber ?? existingInvoice.invoiceNumber,
        serviceAmount: billing.serviceAmount,
        additionalCharges: billing.additionalCharges,
        additionalChargeReason: billing.additionalChargeReason,
        discountAmount: billing.discountAmount,
        taxableAmount: billing.taxableAmount,
        gstPercentage: billing.gstPercentage,
        gstAmount: billing.gstAmount,
        totalAmount: billing.totalAmount,
        paidAmount: billing.paidAmount,
        dueAmount: billing.dueAmount,
        gstin: updateInvoiceDto.gstin ?? existingInvoice.gstin,
        notes: updateInvoiceDto.notes ?? existingInvoice.notes,
      },
      include: {
        jobCard: {
          include: {
            booking: {
              include: {
                serviceCenter: true,
              },
            },
          },
        },
        paymentTransactions: true,
      },
    });
  }

  async remove(id: string) {
    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice) {
      throw new NotFoundException('Invoice not found');
    }

    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}
