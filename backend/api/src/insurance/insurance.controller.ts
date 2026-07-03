import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceEnquiryDto } from './dto/create-insurance-enquiry.dto';
import { UpdateInsuranceEnquiryDto } from './dto/update-insurance-enquiry.dto';

@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Post()
  create(@Body() createInsuranceEnquiryDto: CreateInsuranceEnquiryDto) {
    return this.insuranceService.create(createInsuranceEnquiryDto);
  }

  @Get()
  findAll() {
    return this.insuranceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insuranceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInsuranceEnquiryDto: UpdateInsuranceEnquiryDto,
  ) {
    return this.insuranceService.update(id, updateInsuranceEnquiryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insuranceService.remove(id);
  }
}
