import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsUUID()
  jobCardId: string;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  serviceAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  additionalCharges?: number;

  @IsOptional()
  @IsString()
  additionalChargeReason?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxableAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gstPercentage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gstAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  paidAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dueAmount?: number;

  @IsOptional()
  @IsString()
  gstin?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
