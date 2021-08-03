import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../user/user.dto';
import * as bcrypt from 'bcrypt';
import { Auth } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async login(userDto: UserDto) {
    const user = await this.userRepository.findOne({
      username: userDto.username,
    });

    if (!user) throw new UnauthorizedException();

    const compare = await bcrypt.compare(userDto.password, user.password);

    if (!compare) throw new UnauthorizedException();

    const payload = { username: user.username, id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.secret,
      expiresIn: '3600',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.secret,
      expiresIn: '7d',
    });

    const token = await this.authRepository.findOne({
      userId: user.id,
    });

    if (!token) {
      await this.authRepository.save({
        userId: user.id,
        accessToken,
        refreshToken,
      });
    } else {
      await this.authRepository.update(
        {
          userId: user.id,
        },
        {
          accessToken,
          refreshToken,
        },
      );
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async checkAccessToken(token: string) {
    try {
      const userToken = await this.authRepository.findOne({
        accessToken: token,
      });

      if (!userToken) return null;
    } catch (e) {
      throw new InternalServerErrorException();
    }

    try {
      return this.jwtService.verify(token, { secret: process.env.secret });
    } catch (e) {
      if (e.message === 'jwt expired')
        throw new HttpException('accessToken Expired', 401);
      else if (e.message === 'invalid token') throw new ForbiddenException();
      console.log(e.message);
      return null;
    }
  }

  async checkRefreshToken(token: string) {
    try {
      const userRefreshToken = await this.authRepository.findOne({
        refreshToken: token,
      });

      if (!userRefreshToken) return null;

      return this.jwtService.verify(token, { secret: process.env.secret });
    } catch (e) {
      if (e.message === 'jwt expired')
        throw new HttpException('refreshToken Expired', 401);
      else if (e.message === 'invalid token') throw new ForbiddenException();
      throw new InternalServerErrorException();
    }
  }

  async generateAccessToken(token: string) {
    try {
      const refreshToken = await this.authRepository.findOne({
        refreshToken: token,
      });
      if (!refreshToken) return null;

      const info = this.jwtService.verify(token, {
        secret: process.env.secret,
      });

      const user = await this.userRepository.findOne({
        id: info.id,
      });

      const newToken = this.jwtService.sign(
        { username: user.username, id: user.id },
        {
          secret: process.env.secret,
        },
      );

      await this.authRepository.update(
        {
          userId: user.id,
        },
        {
          accessToken: newToken,
        },
      );

      return { accessToken: newToken };
    } catch (err) {
      if (err.message === 'jwt expired')
        throw new HttpException('JWT Expired', 401);
      else if (err.message === 'Invalid token') throw new ForbiddenException();
      return null;
    }
  }
}
