import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSparePartRequestDto,
  SparePartRequestPaymentMode,
} from './dto/create-spare-part-request.dto';

@Injectable()
export class SparePartRequestService {
  constructor(private readonly prisma: PrismaService) {}

  private toNumber(value: unknown, fallback = 0): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  private round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  async create(createDto: CreateSparePartRequestDto) {
    const serviceCenter = await this.prisma.serviceCenter.findUnique({
      where: { id: createDto.serviceCenterId },
    });

    if (!serviceCenter) {
      throw new NotFoundException('Service center not found');
    }

    if (!createDto.items?.length) {
      throw new BadRequestException('At least one spare part item is required');
    }

    const sparePartIds = createDto.items.map((item) => item.sparePartId);

    const spareParts = await this.prisma.sparePart.findMany({
      where: {
        id: { in: sparePartIds },
        isActive: true,
      },
    });

    if (spareParts.length !== sparePartIds.length) {
      throw new BadRequestException(
        'One or more spare parts are invalid or inactive',
      );
    }

    const partMap = new Map(spareParts.map((part) => [part.id, part]));

    const normalizedItems = createDto.items.map((item) => {
      const part = partMap.get(item.sparePartId);

      if (!part) {
        throw new BadRequestException(
          `Invalid spare part: ${item.sparePartId}`,
        );
      }

      const quantity = Math.max(1, Math.trunc(this.toNumber(item.quantity, 1)));
      const unitPrice = this.round2(
        item.unitPrice !== undefined ? item.unitPrice : (part.price ?? 0),
      );
      const lineTotal = this.round2(quantity * unitPrice);

      return {
        sparePartId: part.id,
        quantity,
        unitPrice,
        lineTotal,
        snapshotName: part.name,
        snapshotPartNumber: part.partNumber ?? '',
        snapshotCategory: part.category ?? '',
        snapshotBrand: part.brand ?? '',
        snapshotType: part.type,
      };
    });

    const totalAmount = this.round2(
      normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    );

    const paidAmount =
      createDto.paymentMode === SparePartRequestPaymentMode.FULL_PAYMENT
        ? totalAmount
        : this.round2(this.toNumber(createDto.paidAmount, 0));

    if (paidAmount > totalAmount) {
      throw new BadRequestException(
        'Paid amount cannot be greater than total amount',
      );
    }

    const creditAmount = this.round2(Math.max(0, totalAmount - paidAmount));

    return this.prisma.sparePartRequest.create({
      data: {
        serviceCenter: {
          connect: { id: createDto.serviceCenterId },
        },
        paymentMode: createDto.paymentMode,
        paidAmount,
        totalAmount,
        creditAmount,
        notes: createDto.notes?.trim() || null,
        items: {
          create: normalizedItems.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
            snapshotName: item.snapshotName,
            snapshotPartNumber: item.snapshotPartNumber,
            snapshotCategory: item.snapshotCategory,
            snapshotBrand: item.snapshotBrand,
            snapshotType: item.snapshotType,
            sparePart: {
              connect: { id: item.sparePartId },
            },
          })),
        },
      },
      include: {
        serviceCenter: true,
        items: {
          include: {
            sparePart: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.sparePartRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        serviceCenter: true,
        items: {
          include: {
            sparePart: true,
          },
        },
      },
    });
  }

  async findByServiceCenter(serviceCenterId: string) {
    return this.prisma.sparePartRequest.findMany({
      where: {
        serviceCenterId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        serviceCenter: true,
        items: {
          include: {
            sparePart: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.sparePartRequest.findUnique({
      where: { id },
      include: {
        serviceCenter: true,
        items: {
          include: {
            sparePart: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Spare part request not found');
    }

    return request;
  }
}
