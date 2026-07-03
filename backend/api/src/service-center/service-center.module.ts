import { Module } from '@nestjs/common';
import { ServiceCenterController } from './service-center.controller';
import { ServiceCenterService } from './service-center.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ServiceCenterController],
  providers: [ServiceCenterService, PrismaService],
})
export class ServiceCenterModule {}
