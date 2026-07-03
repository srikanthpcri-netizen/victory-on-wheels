import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceCenterDto } from './create-service-center.dto';

export class UpdateServiceCenterDto extends PartialType(
  CreateServiceCenterDto,
) {}
