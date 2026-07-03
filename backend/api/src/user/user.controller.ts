import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body.phone, body.role, body.name);
  }

  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get('profile/by-phone')
  getProfileByPhone(@Query('phone') phone: string) {
    return this.userService.getProfileByPhone(phone);
  }

  @Patch('profile/by-phone')
  updateProfileByPhone(
    @Query('phone') phone: string,
    @Body()
    body: {
      name?: string;
      email?: string;
      address?: string;
    },
  ) {
    return this.userService.updateProfileByPhone(phone, body);
  }

  @Patch('change-password/by-phone')
  changePasswordByPhone(
    @Query('phone') phone: string,
    @Body()
    body: {
      currentPassword: string;
      newPassword: string;
    },
  ) {
    return this.userService.changePasswordByPhone(
      phone,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: CreateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
