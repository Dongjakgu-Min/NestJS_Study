import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  test(): string {
    return 'Hello World!';
  }

  async signUp(userDto: UserDto) {
    const salt: string = await bcrypt.genSalt(10);
    userDto.password = await bcrypt.hash(userDto.password, salt);
    await this.userRepository.save(userDto);
  }
}
