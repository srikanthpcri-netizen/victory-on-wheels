import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const vehicleNumber = createBookingDto.vehicleNumber.trim().toUpperCase();

    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: {
        registrationNumber: vehicleNumber,
      },
    });

    const vehicle =
      existingVehicle ||
      (await this.prisma.vehicle.create({
        data: {
          customerPhone: createBookingDto.customerPhone,
          ownerName: createBookingDto.customerName,
          vehicleType: createBookingDto.vehicleType || 'Car',
          vehicleBrand: createBookingDto.vehicleBrand || '',
          vehicleModel: createBookingDto.vehicleModel || '',
          registrationNumber: vehicleNumber,
          manufacturingYear: createBookingDto.manufacturingYear,
          fuelType: createBookingDto.fuelType,
          transmission: createBookingDto.transmission,
          odometer: createBookingDto.odometer,
          color: '',
          isDefault: false,
        },
      }));

    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        vehicleNumber,
        vehicleId: vehicle.id,
        status: 'PENDING',
        jobCard: {
          create: {
            vehicleNumber,
            serviceType: createBookingDto.serviceType,
            status: 'CREATED',
          },
        },
      },
      include: {
        serviceCenter: true,
        vehicle: true,
        jobCard: true,
      },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        serviceCenter: true,
        vehicle: true,
        jobCard: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        serviceCenter: true,
        vehicle: true,
        jobCard: true,
      },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      include: {
        serviceCenter: true,
        vehicle: true,
        jobCard: true,
      },
    });

    if (updateBookingDto.status === 'CONFIRMED') {
      await this.prisma.jobCard.update({
        where: { bookingId: id },
        data: {
          status: 'INSPECTION_PENDING',
        },
      });

      return this.prisma.booking.findUnique({
        where: { id },
        include: {
          serviceCenter: true,
          vehicle: true,
          jobCard: true,
        },
      });
    }

    if (updateBookingDto.status === 'COMPLETED') {
      await this.prisma.jobCard.update({
        where: { bookingId: id },
        data: {
          status: 'CLOSED',
        },
      });

      return this.prisma.booking.findUnique({
        where: { id },
        include: {
          serviceCenter: true,
          vehicle: true,
          jobCard: true,
        },
      });
    }

    if (updateBookingDto.status === 'CANCELLED') {
      await this.prisma.jobCard.update({
        where: { bookingId: id },
        data: {
          status: 'CLOSED',
        },
      });

      return this.prisma.booking.findUnique({
        where: { id },
        include: {
          serviceCenter: true,
          vehicle: true,
          jobCard: true,
        },
      });
    }

    return updatedBooking;
  }

  async remove(id: string) {
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
