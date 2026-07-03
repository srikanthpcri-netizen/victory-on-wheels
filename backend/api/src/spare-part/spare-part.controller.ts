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
import { SparePartService } from './spare-part.service';
import { CreateSparePartDto } from './dto/create-spare-part.dto';

@Controller('spare-part')
export class SparePartController {
  constructor(private readonly sparePartService: SparePartService) {}

  @Post()
  create(@Body() createSparePartDto: CreateSparePartDto) {
    return this.sparePartService.create(createSparePartDto);
  }

  @Get('active')
  findActive(
    @Query('search') search?: string,
    @Query('type') type?: 'OEM' | 'OES',
  ) {
    return this.sparePartService.findActive({ search, type });
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('type') type?: 'OEM' | 'OES',
  ) {
    return this.sparePartService.findAll({ search, type });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sparePartService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateSparePartDto>) {
    return this.sparePartService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sparePartService.remove(id);
  }
}
