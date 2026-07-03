import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AddOnService } from './add-on.service';
import { CreateAddOnDto } from './dto/create-add-on.dto';
import { UpdateAddOnDto } from './dto/update-add-on.dto';

@Controller('add-on')
export class AddOnController {
  constructor(private readonly addOnService: AddOnService) {}

  @Post()
  create(@Body() createAddOnDto: CreateAddOnDto) {
    return this.addOnService.create(createAddOnDto);
  }

  @Get()
  findAll() {
    return this.addOnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addOnService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddOnDto: UpdateAddOnDto) {
    return this.addOnService.update(id, updateAddOnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addOnService.remove(id);
  }
}