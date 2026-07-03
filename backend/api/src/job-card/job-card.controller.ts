import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { JobCardService } from './job-card.service';
import { CreateJobCardDto } from './dto/create-job-card.dto';
import { UpdateJobCardDto } from './dto/update-job-card.dto';

@Controller('job-card')
export class JobCardController {
  constructor(private readonly jobCardService: JobCardService) {}

  @Post()
  create(@Body() createJobCardDto: CreateJobCardDto) {
    return this.jobCardService.create(createJobCardDto);
  }

  @Get()
  findAll() {
    return this.jobCardService.findAll();
  }

  @Get('customer/latest')
  findLatestByCustomerPhone(@Query('customerPhone') customerPhone: string) {
    return this.jobCardService.findLatestByCustomerPhone(customerPhone);
  }

  @Get('by-booking/:bookingId')
  findByBookingId(@Param('bookingId') bookingId: string) {
    return this.jobCardService.findByBookingId(bookingId);
  }

  @Post(':id/attachment')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/job-cards',
        filename: (_req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1_000_000,
          )}${extname(file.originalname)}`;

          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
    }),
  )
  uploadAttachment(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Query('category') category: string,
    @Query('notes') notes?: string,
  ) {
    return this.jobCardService.addAttachment(id, file, category, notes);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobCardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobCardDto: UpdateJobCardDto) {
    return this.jobCardService.update(id, updateJobCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobCardService.remove(id);
  }
}
