import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(phone: string, role: Role, name?: string) {
    try {
      return await this.prisma.user.create({
        data: {
          phone,
          role,
          name,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Phone number already exists');
      }

      throw error;
    }
  }

  getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getProfileByPhone(phone: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfileByPhone(
    phone: string,
    body: {
      name?: string;
      email?: string;
      address?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: {
        phone,
      },
      data: {
        name: body.name,
        email: body.email,
        address: body.address,
      },
    });
  }

  async changePasswordByPhone(
    phone: string,
    currentPassword: string,
    newPassword: string,
  ) {
    return {
      success: false,
      message:
        'Password authentication is not implemented yet. Current login is phone-based. This API is reserved for future password/JWT authentication.',
    };
  }

  updateUser(id: string, body: { name?: string; phone: string; role: Role }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        phone: body.phone,
        role: body.role,
      },
    });
  }

  deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
