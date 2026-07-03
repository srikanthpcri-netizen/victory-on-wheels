import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  vehicleNumber: string;

  @IsString()
  @IsOptional()
  vehicleType?: string;

  @IsString()
  @IsOptional()
  vehicleBrand?: string;

  @IsString()
  @IsOptional()
  vehicleModel?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  manufacturingYear?: number;

  @IsString()
  @IsOptional()
  fuelType?: string;

  @IsString()
  @IsOptional()
  transmission?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  odometer?: number;

  @IsBoolean()
  @IsOptional()
  pickupRequired?: boolean;

  @IsBoolean()
  @IsOptional()
  emergencyService?: boolean;

  @IsString()
  @IsOptional()
  preferredTimeSlot?: string;

  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  bookingDate: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  serviceCenterId: string;
}
