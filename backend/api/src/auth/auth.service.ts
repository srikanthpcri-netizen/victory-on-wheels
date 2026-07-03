import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {
    this.initializeFirebaseAdmin();
  }

  private initializeFirebaseAdmin() {
    if (getApps().length > 0) {
      return;
    }

    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
    const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
      /\\n/g,
      '\n',
    );

    if (firebaseProjectId && firebaseClientEmail && firebasePrivateKey) {
      initializeApp({
        credential: cert({
          projectId: firebaseProjectId,
          clientEmail: firebaseClientEmail,
          privateKey: firebasePrivateKey,
        }),
      });

      return;
    }

    const serviceAccountPath = path.join(
      process.cwd(),
      'firebase-service-account.json',
    );

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(
        'Firebase Admin credentials missing. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in Railway variables.',
      );
    }

    const serviceAccount = JSON.parse(
      fs.readFileSync(serviceAccountPath, 'utf8'),
    );

    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  private createBackendJwt(payload: {
    sub: string;
    phone: string;
    role: Role;
    name?: string | null;
  }) {
    const secret = process.env.JWT_SECRET || 'victory-on-wheels-dev-secret';

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);

    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + 7 * 24 * 60 * 60,
    };

    const base64Url = (input: object) =>
      Buffer.from(JSON.stringify(input)).toString('base64url');

    const encodedHeader = base64Url(header);
    const encodedPayload = base64Url(tokenPayload);

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private normalizePhoneNumber(firebasePhone: string) {
    const digitsOnly = firebasePhone.replace(/\D/g, '');

    if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      return digitsOnly.slice(2);
    }

    if (digitsOnly.length === 10) {
      return digitsOnly;
    }

    return digitsOnly;
  }

  async serviceCenterLogin(phone: string) {
    const serviceCenter = await this.prisma.serviceCenter.findUnique({
      where: { phone },
    });

    if (!serviceCenter) {
      throw new UnauthorizedException('Service center not found');
    }

    return {
      message: 'Login successful',
      access_token: 'demo-token-123',
      serviceCenter: {
        id: serviceCenter.id,
        name: serviceCenter.name,
        city: serviceCenter.city,
        phone: serviceCenter.phone,
      },
    };
  }

  async customerLogin(phone: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        customerPhone: phone,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        serviceCenter: true,
        jobCard: {
          include: {
            attachments: true,
            invoice: {
              include: {
                paymentTransactions: true,
              },
            },
          },
        },
      },
    });

    if (bookings.length === 0) {
      throw new UnauthorizedException('Customer not found');
    }

    const latestBooking = bookings[0];

    return {
      message: 'Login successful',
      access_token: 'demo-customer-token-123',
      customer: {
        name: latestBooking.customerName,
        phone: latestBooking.customerPhone,
        totalBookings: bookings.length,
      },
    };
  }

  async firebaseCustomerLogin(firebaseIdToken: string) {
    if (!firebaseIdToken) {
      throw new UnauthorizedException('Firebase ID token is required');
    }

    const decodedToken = await getAuth().verifyIdToken(firebaseIdToken);

    if (!decodedToken.phone_number) {
      throw new UnauthorizedException(
        'Phone number not found in Firebase token',
      );
    }

    const phone = this.normalizePhoneNumber(decodedToken.phone_number);

    let user = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          role: Role.CUSTOMER,
          name: 'Customer',
        },
      });
    }

    const accessToken = this.createBackendJwt({
      sub: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
    });

    return {
      message: 'Firebase customer login successful',
      access_token: accessToken,
      customer: {
        id: user.id,
        name: user.name || 'Customer',
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    };
  }
}
