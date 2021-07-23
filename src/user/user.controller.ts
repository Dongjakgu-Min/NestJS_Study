import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(): string {
    return this.userService.test();
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() userDto: UserDto) {
    await this.userService.signUp(userDto);
    return;
  }
}
