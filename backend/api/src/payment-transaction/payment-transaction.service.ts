import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentTransactionDto } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';

@Injectable()
export class PaymentTransactionService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentTransactionDto: CreatePaymentTransactionDto) {
    try {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id: createPaymentTransactionDto.invoiceId },
        include: {
          paymentTransactions: true,
        },
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      if (createPaymentTransactionDto.amount <= 0) {
        throw new BadRequestException('Payment amount must be greater than 0');
      }

      const currentPaidAmount = invoice.paidAmount || 0;

      const newPaidAmount =
        currentPaidAmount + createPaymentTransactionDto.amount;

      if (newPaidAmount > invoice.totalAmount) {
        throw new BadRequestException('Payment exceeds invoice total amount');
      }

      let paymentStatus = 'UNPAID';

      if (newPaidAmount === 0) {
        paymentStatus = 'UNPAID';
      } else if (newPaidAmount < invoice.totalAmount) {
        paymentStatus = 'PARTIAL';
      } else if (newPaidAmount === invoice.totalAmount) {
        paymentStatus = 'PAID';
      }

      return this.prisma.$transaction(async (tx) => {
        const transaction = await tx.paymentTransaction.create({
          data: {
            invoiceId: createPaymentTransactionDto.invoiceId,
            amount: createPaymentTransactionDto.amount,
            paymentMethod: createPaymentTransactionDto.paymentMethod,
            referenceNumber: createPaymentTransactionDto.referenceNumber,
            notes: createPaymentTransactionDto.notes,
          },
        });

        const updatedInvoice = await tx.invoice.update({
          where: { id: createPaymentTransactionDto.invoiceId },
          data: {
            paidAmount: newPaidAmount,
          },
        });

        return {
          message: 'Payment transaction created successfully',
          transaction,
          invoice: updatedInvoice,
        };
      });
    } catch (error) {
      console.error('PAYMENT TRANSACTION CREATE ERROR:', error);
      throw error;
    }
  }

  async findAll(invoiceId?: string) {
    return this.prisma.paymentTransaction.findMany({
      where: invoiceId ? { invoiceId } : {},
      include: {
        invoice: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        invoice: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Payment transaction not found');
    }

    return transaction;
  }

  update(id: string, updatePaymentTransactionDto: UpdatePaymentTransactionDto) {
    return `This action updates a #${id} paymentTransaction`;
  }

  remove(id: string) {
    return `This action removes a #${id} paymentTransaction`;
  }
}
