import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SparePartRequestPaymentMode {
  FULL_PAYMENT = 'FULL_PAYMENT',
  CREDIT = 'CREDIT',
}

export class SparePartRequestItemDto {
  @IsUUID()
  sparePartId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice?: number;
}

export class CreateSparePartRequestDto {
  @IsUUID()
  serviceCenterId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SparePartRequestItemDto)
  items: SparePartRequestItemDto[];

  @IsEnum(SparePartRequestPaymentMode)
  paymentMode: SparePartRequestPaymentMode;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  paidAmount?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;
}
