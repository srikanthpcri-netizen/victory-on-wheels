import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInsuranceEnquiryDto } from './dto/create-insurance-enquiry.dto';
import { UpdateInsuranceEnquiryDto } from './dto/update-insurance-enquiry.dto';

@Injectable()
export class InsuranceService {
  constructor(private prisma: PrismaService) {}

  async create(createInsuranceEnquiryDto: CreateInsuranceEnquiryDto) {
    return this.prisma.insuranceEnquiry.create({
      data: {
        fullName: createInsuranceEnquiryDto.fullName,
        mobileNumber: createInsuranceEnquiryDto.mobileNumber,
        email: createInsuranceEnquiryDto.email,
        city: createInsuranceEnquiryDto.city,
        vehicleType: createInsuranceEnquiryDto.vehicleType,
        vehicleBrand: createInsuranceEnquiryDto.vehicleBrand,
        vehicleModel: createInsuranceEnquiryDto.vehicleModel,
        registrationNumber: createInsuranceEnquiryDto.registrationNumber,
        manufacturingYear: Number(createInsuranceEnquiryDto.manufacturingYear),
        previousPolicyProvider:
          createInsuranceEnquiryDto.previousPolicyProvider,
        insuranceType: createInsuranceEnquiryDto.insuranceType,
        policyExpiryDate: createInsuranceEnquiryDto.policyExpiryDate
          ? new Date(createInsuranceEnquiryDto.policyExpiryDate)
          : undefined,
        claimHistory: createInsuranceEnquiryDto.claimHistory,
        additionalNotes: createInsuranceEnquiryDto.additionalNotes,
      },
    });
  }

  async findAll() {
    return this.prisma.insuranceEnquiry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.insuranceEnquiry.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updateInsuranceEnquiryDto: UpdateInsuranceEnquiryDto,
  ) {
    return this.prisma.insuranceEnquiry.update({
      where: { id },
      data: {
        ...updateInsuranceEnquiryDto,
        manufacturingYear:
          updateInsuranceEnquiryDto.manufacturingYear !== undefined
            ? Number(updateInsuranceEnquiryDto.manufacturingYear)
            : undefined,
        policyExpiryDate: updateInsuranceEnquiryDto.policyExpiryDate
          ? new Date(updateInsuranceEnquiryDto.policyExpiryDate)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.insuranceEnquiry.delete({
      where: { id },
    });
  }
}
