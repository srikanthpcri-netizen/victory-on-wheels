import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobCardDto } from './dto/create-job-card.dto';
import { UpdateJobCardDto } from './dto/update-job-card.dto';

@Injectable()
export class JobCardService {
  constructor(private prisma: PrismaService) {}

  private jobCardInclude = {
    booking: {
      include: {
        serviceCenter: true,
        vehicle: true,
      },
    },
    attachments: {
      orderBy: {
        createdAt: 'desc' as const,
      },
    },
  };

  async create(createJobCardDto: CreateJobCardDto) {
    return this.prisma.jobCard.create({
      data: createJobCardDto,
      include: this.jobCardInclude,
    });
  }

  async findAll() {
    return this.prisma.jobCard.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: this.jobCardInclude,
    });
  }

  async findLatestByCustomerPhone(customerPhone: string) {
    const latestJobCard = await this.prisma.jobCard.findFirst({
      where: {
        booking: {
          customerPhone,
        },
      },
      orderBy: {
        booking: {
          createdAt: 'desc',
        },
      },
      include: this.jobCardInclude,
    });

    if (!latestJobCard) {
      throw new NotFoundException('No job card found for this customer');
    }

    return latestJobCard;
  }

  async findByBookingId(bookingId: string) {
    const existingJobCard = await this.prisma.jobCard.findUnique({
      where: {
        bookingId,
      },
      include: this.jobCardInclude,
    });

    if (existingJobCard) {
      return existingJobCard;
    }

    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        serviceCenter: true,
        vehicle: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.jobCard.create({
      data: {
        bookingId: booking.id,
        vehicleNumber: booking.vehicleNumber,
        serviceType: booking.serviceType,
        problemNotes: booking.notes || null,
        status: 'CREATED',
        estimatedAmount: 0,
        labourAmount: 0,
        finalAmount: 0,
        additionalCharges: 0,
      },
      include: this.jobCardInclude,
    });
  }

  async findOne(id: string) {
    const jobCard = await this.prisma.jobCard.findUnique({
      where: { id },
      include: this.jobCardInclude,
    });

    if (!jobCard) {
      throw new NotFoundException('Job Card not found');
    }

    return jobCard;
  }

  async update(id: string, updateJobCardDto: UpdateJobCardDto) {
    const existingJobCard = await this.prisma.jobCard.findUnique({
      where: { id },
    });

    if (!existingJobCard) {
      throw new NotFoundException('Job Card not found');
    }

    return this.prisma.jobCard.update({
      where: { id },
      data: updateJobCardDto,
      include: this.jobCardInclude,
    });
  }

  async addAttachment(
    jobCardId: string,
    file: any,
    category = 'GENERAL',
    notes?: string,
  ) {
    const existingJobCard = await this.prisma.jobCard.findUnique({
      where: { id: jobCardId },
    });

    if (!existingJobCard) {
      throw new NotFoundException('Job Card not found');
    }

    await this.prisma.jobCardAttachment.create({
      data: {
        jobCardId,
        fileUrl: `/uploads/job-cards/${file.filename}`,
        fileName: file.originalname,
        fileType: file.mimetype,
        category,
        notes: notes || null,
      },
    });

    return this.findOne(jobCardId);
  }

  async remove(id: string) {
    const existingJobCard = await this.prisma.jobCard.findUnique({
      where: { id },
    });

    if (!existingJobCard) {
      throw new NotFoundException('Job Card not found');
    }

    return this.prisma.jobCard.delete({
      where: { id },
    });
  }
}
