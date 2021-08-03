import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../user/user.dto';
import { AccessTokenGuard } from './guard/guard.accessToken';
import { RefreshTokenGuard } from './guard/guard.refreshToken';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() userDto: UserDto) {
    return this.authService.login(userDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('accessToken')
  async getAccessToken(@Request() req) {
    return this.authService.generateAccessToken(req.headers['refresh_token']);
  }
}
