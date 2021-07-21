import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemoModule } from './memo/memo.module';
import AppDatabase from './app.database';
import { Connection } from 'typeorm';

@Module({
  imports: [MemoModule, AppDatabase],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
