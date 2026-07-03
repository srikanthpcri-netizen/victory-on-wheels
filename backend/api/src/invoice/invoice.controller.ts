import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Post('save')
  createOrUpdateByJobCard(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createOrUpdateByJobCard(createInvoiceDto);
  }

  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get('customer/latest')
  findLatestByCustomer(@Query('customerPhone') customerPhone: string) {
    return this.invoiceService.findLatestByCustomer(customerPhone);
  }

  @Get('customer/all')
  findAllByCustomer(@Query('customerPhone') customerPhone: string) {
    return this.invoiceService.findAllByCustomer(customerPhone);
  }

  @Get('by-job-card/:jobCardId')
  findByJobCard(@Param('jobCardId') jobCardId: string) {
    return this.invoiceService.findByJobCard(jobCardId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }
}
