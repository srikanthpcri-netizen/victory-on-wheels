import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SparePartRequestService } from './spare-part-request.service';
import { CreateSparePartRequestDto } from './dto/create-spare-part-request.dto';

@Controller('spare-part-request')
export class SparePartRequestController {
  constructor(
    private readonly sparePartRequestService: SparePartRequestService,
  ) {}

  @Post()
  create(@Body() createSparePartRequestDto: CreateSparePartRequestDto) {
    return this.sparePartRequestService.create(createSparePartRequestDto);
  }

  @Get()
  findAll() {
    return this.sparePartRequestService.findAll();
  }

  @Get('service-center/:serviceCenterId')
  findByServiceCenter(@Param('serviceCenterId') serviceCenterId: string) {
    return this.sparePartRequestService.findByServiceCenter(serviceCenterId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sparePartRequestService.findOne(id);
  }
}
