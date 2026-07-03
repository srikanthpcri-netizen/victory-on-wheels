import { Module } from '@nestjs/common';
import { AddOnService } from './add-on.service';
import { AddOnController } from './add-on.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AddOnController],
  providers: [AddOnService],
})
export class AddOnModule {}