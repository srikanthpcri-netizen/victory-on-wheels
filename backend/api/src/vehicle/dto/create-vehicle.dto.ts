import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @IsString()
  @IsNotEmpty()
  vehicleBrand: string;

  @IsString()
  @IsNotEmpty()
  vehicleModel: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

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

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
