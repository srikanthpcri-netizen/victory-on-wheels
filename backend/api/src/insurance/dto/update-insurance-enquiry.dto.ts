import { PartialType } from '@nestjs/mapped-types';
import { CreateInsuranceEnquiryDto } from './create-insurance-enquiry.dto';

export class UpdateInsuranceEnquiryDto extends PartialType(
  CreateInsuranceEnquiryDto,
) {}
