import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto) {
    if (createVehicleDto.isDefault) {
      await this.prisma.vehicle.updateMany({
        where: {
          customerPhone: createVehicleDto.customerPhone,
        },
        data: {
          isDefault: false,
        },
      });
    }

    return this.prisma.vehicle.create({
      data: createVehicleDto,
    });
  }

  async findAll(customerPhone?: string) {
    return this.prisma.vehicle.findMany({
      where: customerPhone
        ? {
            customerPhone,
          }
        : undefined,
      orderBy: [
        {
          isDefault: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  async findOne(id: string) {
    return this.prisma.vehicle.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.vehicle.delete({
      where: { id },
    });
  }

  async setDefault(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    await this.prisma.vehicle.updateMany({
      where: {
        customerPhone: vehicle.customerPhone,
      },
      data: {
        isDefault: false,
      },
    });

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        isDefault: true,
      },
    });
  }
}
