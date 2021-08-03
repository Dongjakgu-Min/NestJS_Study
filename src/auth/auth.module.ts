import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { Auth } from './auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth]),
    JwtModule.register({
      secret: process.env.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
