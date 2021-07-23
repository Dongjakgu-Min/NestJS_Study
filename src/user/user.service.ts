import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: Repository<User>) {}

  test(): string {
    return 'Hello World!';
  }

  async signUp(userDto: UserDto) {
    await userDto.cryptPassword();
    await this.userRepository.save(userDto);
  }
}
