import { Module } from '@nestjs/common';
import { SparePartRequestController } from './spare-part-request.controller';
import { SparePartRequestService } from './spare-part-request.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SparePartRequestController],
  providers: [SparePartRequestService],
  exports: [SparePartRequestService],
})
export class SparePartRequestModule {}
