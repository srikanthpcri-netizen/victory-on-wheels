import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddOnDto } from './dto/create-add-on.dto';
import { UpdateAddOnDto } from './dto/update-add-on.dto';

@Injectable()
export class AddOnService {
  constructor(private prisma: PrismaService) {}

  async create(createAddOnDto: CreateAddOnDto) {
    return this.prisma.addOn.create({
      data: createAddOnDto,
      include: {
        jobCard: true,
      },
    });
  }

  async findAll() {
    return this.prisma.addOn.findMany({
      include: {
        jobCard: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.addOn.findUnique({
      where: { id },
      include: {
        jobCard: true,
      },
    });
  }

  async update(id: string, updateAddOnDto: UpdateAddOnDto) {
    const existingAddOn = await this.prisma.addOn.findUnique({
      where: { id },
    });

    const updatedAddOn = await this.prisma.addOn.update({
      where: { id },
      data: updateAddOnDto,
      include: {
        jobCard: true,
      },
    });

    // BUSINESS LOGIC:
    // If add-on becomes APPROVED for first time, add price to estimatedAmount
    if (
      existingAddOn &&
      existingAddOn.status !== 'APPROVED' &&
      updateAddOnDto.status === 'APPROVED'
    ) {
      const jobCard = await this.prisma.jobCard.findUnique({
        where: { id: updatedAddOn.jobCardId },
      });

      if (jobCard) {
        const newEstimatedAmount =
          (jobCard.estimatedAmount || 0) + updatedAddOn.price;

        await this.prisma.jobCard.update({
          where: { id: updatedAddOn.jobCardId },
          data: {
            estimatedAmount: newEstimatedAmount,
            finalAmount: newEstimatedAmount + (jobCard.labourAmount || 0),
          },
        });
      }
    }

    // If approved add-on becomes REJECTED later, subtract from estimatedAmount
    if (
      existingAddOn &&
      existingAddOn.status === 'APPROVED' &&
      updateAddOnDto.status === 'REJECTED'
    ) {
      const jobCard = await this.prisma.jobCard.findUnique({
        where: { id: updatedAddOn.jobCardId },
      });

      if (jobCard) {
        const newEstimatedAmount =
          (jobCard.estimatedAmount || 0) - updatedAddOn.price;

        await this.prisma.jobCard.update({
          where: { id: updatedAddOn.jobCardId },
          data: {
            estimatedAmount: newEstimatedAmount,
            finalAmount: newEstimatedAmount + (jobCard.labourAmount || 0),
          },
        });
      }
    }

    return this.prisma.addOn.findUnique({
      where: { id },
      include: {
        jobCard: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.addOn.delete({
      where: { id },
    });
  }
}
