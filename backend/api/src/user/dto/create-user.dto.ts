import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsEnum(Role)
  role: Role;
}
