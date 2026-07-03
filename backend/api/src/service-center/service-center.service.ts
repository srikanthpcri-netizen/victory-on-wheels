import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceCenterDto } from './dto/create-service-center.dto';
import { UpdateServiceCenterDto } from './dto/update-service-center.dto';

@Injectable()
export class ServiceCenterService {
  constructor(private prisma: PrismaService) {}

  create(body: CreateServiceCenterDto) {
    return this.prisma.serviceCenter.create({
      data: {
        name: body.name,
        city: body.city,
        phone: body.phone,
        address: body.address,
        status: body.status ?? 'ACTIVE',
        creditLimit: body.creditLimit ?? 0,
        usedCredit: body.usedCredit ?? 0,
        outstandingAmount: body.outstandingAmount ?? 0,
      },
    });
  }

  findAll() {
    return this.prisma.serviceCenter.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.serviceCenter.findUnique({
      where: { id },
    });
  }

  update(id: string, body: UpdateServiceCenterDto) {
    return this.prisma.serviceCenter.update({
      where: { id },
      data: {
        name: body.name,
        city: body.city,
        phone: body.phone,
        address: body.address,
        status: body.status,
        creditLimit: body.creditLimit,
        usedCredit: body.usedCredit,
        outstandingAmount: body.outstandingAmount,
      },
    });
  }

  remove(id: string) {
    return this.prisma.serviceCenter.delete({
      where: { id },
    });
  }
}
