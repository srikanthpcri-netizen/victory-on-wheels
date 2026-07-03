import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ServiceCenterModule } from './service-center/service-center.module';
import { BookingModule } from './booking/booking.module';
import { JobCardModule } from './job-card/job-card.module';
import { AddOnModule } from './add-on/add-on.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PaymentTransactionModule } from './payment-transaction/payment-transaction.module';
import { InsuranceModule } from './insurance/insurance.module';
import { AuthModule } from './auth/auth.module';
import { SparePartModule } from './spare-part/spare-part.module';
import { SparePartRequestModule } from './spare-part-request/spare-part-request.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ServiceCenterModule,
    BookingModule,
    JobCardModule,
    AddOnModule,
    InvoiceModule,
    PaymentTransactionModule,
    InsuranceModule,
    AuthModule,
    SparePartModule,
    SparePartRequestModule,
    VehicleModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
