import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });
  }

  async createOrder(body: { amount: number }) {
    const amountInPaise = Math.round(body.amount * 100);

    return this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `vow_${Date.now()}`,
      payment_capture: true,
    });
  }
}
