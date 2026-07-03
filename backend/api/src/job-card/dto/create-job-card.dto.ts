import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { JobCardStatus } from '@prisma/client';

export class CreateJobCardDto {
  @IsUUID()
  bookingId: string;

  @IsString()
  vehicleNumber: string;

  @IsString()
  serviceType: string;

  @IsOptional()
  @IsString()
  problemNotes?: string;

  @IsOptional()
  @IsEnum(JobCardStatus)
  status?: JobCardStatus;

  @IsOptional()
  @IsNumber()
  estimatedAmount?: number;

  @IsOptional()
  @IsNumber()
  finalAmount?: number;

  @IsOptional()
  @IsNumber()
  labourAmount?: number;
}
