import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { MemoController } from '../memo/memo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [MemoController],
})
export class UserModule {}
