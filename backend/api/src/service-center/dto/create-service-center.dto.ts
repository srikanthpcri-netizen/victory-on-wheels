import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceCenterDto {
  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  creditLimit?: number;

  @IsOptional()
  @IsNumber()
  usedCredit?: number;

  @IsOptional()
  @IsNumber()
  outstandingAmount?: number;
}
