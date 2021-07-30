import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.secret,
        expiresIn: '3600',
      }),
    };
  }
}
