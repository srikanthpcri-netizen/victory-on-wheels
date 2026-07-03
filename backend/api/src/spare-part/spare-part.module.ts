import { Module } from '@nestjs/common';
import { SparePartController } from './spare-part.controller';
import { SparePartService } from './spare-part.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SparePartController],
  providers: [SparePartService],
  exports: [SparePartService],
})
export class SparePartModule {}
