import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('service-center-login')
  serviceCenterLogin(@Body() body: { phone: string }) {
    return this.authService.serviceCenterLogin(body.phone);
  }

  @Post('customer-login')
  customerLogin(@Body() body: { phone: string }) {
    return this.authService.customerLogin(body.phone);
  }

  @Post('firebase-customer-login')
  firebaseCustomerLogin(@Body() body: { firebaseIdToken: string }) {
    return this.authService.firebaseCustomerLogin(body.firebaseIdToken);
  }
}
