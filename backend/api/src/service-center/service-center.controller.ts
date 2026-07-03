import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ServiceCenterService } from './service-center.service';
import { CreateServiceCenterDto } from './dto/create-service-center.dto';

@Controller('service-center')
export class ServiceCenterController {
  constructor(private readonly serviceCenterService: ServiceCenterService) {}

  @Post()
  create(@Body() body: CreateServiceCenterDto) {
    return this.serviceCenterService.create(body);
  }

  @Get()
  findAll() {
    return this.serviceCenterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceCenterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: CreateServiceCenterDto) {
    return this.serviceCenterService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceCenterService.remove(id);
  }
}
