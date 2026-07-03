import { Module } from '@nestjs/common';
import { JobCardService } from './job-card.service';
import { JobCardController } from './job-card.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JobCardController],
  providers: [JobCardService],
})
export class JobCardModule {}
