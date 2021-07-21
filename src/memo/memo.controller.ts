import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { MemoService } from './memo.service';
import { Memo } from './memo.entity';
import { CreateMemoDto } from './memo.dto';

@Controller('memo')
export class MemoController {
  constructor(private readonly memoService: MemoService) {}

  @Get()
  getMemo(): Promise<Memo[]> {
    return this.memoService.findAll();
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createMemoDto: CreateMemoDto) {
    return this.memoService.createOne(createMemoDto);
  }
}
