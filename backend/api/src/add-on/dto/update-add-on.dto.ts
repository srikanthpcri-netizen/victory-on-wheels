import { PartialType } from '@nestjs/mapped-types';
import { CreateAddOnDto } from './create-add-on.dto';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddOnDto extends PartialType(CreateAddOnDto) {
  @IsOptional()
  @IsString()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}