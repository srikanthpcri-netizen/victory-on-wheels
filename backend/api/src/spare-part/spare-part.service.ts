import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSparePartDto } from './dto/create-spare-part.dto';

@Injectable()
export class SparePartService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSparePartDto: CreateSparePartDto) {
    return this.prisma.sparePart.create({
      data: {
        name: createSparePartDto.name,
        partNumber: createSparePartDto.partNumber,
        category: createSparePartDto.category,
        brand: createSparePartDto.brand,
        unit: createSparePartDto.unit,
        stockQty: createSparePartDto.stockQty ?? 0,
        price: createSparePartDto.price ?? 0,
        type: createSparePartDto.type,
        isActive: createSparePartDto.isActive ?? true,
      },
    });
  }

  async findAll(query?: { search?: string; type?: 'OEM' | 'OES' }) {
    const search = query?.search?.trim();
    const type = query?.type;

    return this.prisma.sparePart.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { partNumber: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findActive(query?: { search?: string; type?: 'OEM' | 'OES' }) {
    const search = query?.search?.trim();
    const type = query?.type;

    return this.prisma.sparePart.findMany({
      where: {
        isActive: true,
        ...(type ? { type } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { partNumber: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.sparePart.findUnique({
      where: { id },
    });
  }

  async update(id: string, body: Partial<CreateSparePartDto>) {
    return this.prisma.sparePart.update({
      where: { id },
      data: {
        name: body.name,
        partNumber: body.partNumber,
        category: body.category,
        brand: body.brand,
        unit: body.unit,
        stockQty:
          body.stockQty !== undefined ? Number(body.stockQty) : undefined,
        price: body.price !== undefined ? Number(body.price) : undefined,
        type: body.type,
        isActive: body.isActive,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.sparePart.delete({
      where: { id },
    });
  }
}
