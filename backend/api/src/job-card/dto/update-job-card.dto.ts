import { PartialType } from '@nestjs/mapped-types';
import { CreateJobCardDto } from './create-job-card.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { JobCardStatus } from '@prisma/client';

export class UpdateJobCardDto extends PartialType(CreateJobCardDto) {
  @IsOptional()
  @IsEnum(JobCardStatus)
  status?: JobCardStatus;

  @IsOptional()
  @IsString()
  problemNotes?: string;

  @IsOptional()
  @IsNumber()
  estimatedAmount?: number;

  @IsOptional()
  @IsNumber()
  labourAmount?: number;

  @IsOptional()
  @IsNumber()
  additionalCharges?: number;

  @IsOptional()
  @IsString()
  additionalChargeReason?: string;

  @IsOptional()
  @IsNumber()
  finalAmount?: number;
}
