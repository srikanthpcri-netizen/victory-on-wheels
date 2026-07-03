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
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleService } from './vehicle.service';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  create(@Body() body: CreateVehicleDto) {
    return this.vehicleService.create(body);
  }

  @Get()
  findAll(@Query('customerPhone') customerPhone?: string) {
    return this.vehicleService.findAll(customerPhone);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @Patch(':id/default')
  setDefault(@Param('id') id: string) {
    return this.vehicleService.setDefault(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }
}
