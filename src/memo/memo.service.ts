import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Memo } from './memo.entity';
import { Connection, Repository } from 'typeorm';
import { CreateMemoDto } from './memo.dto';

@Injectable()
export class MemoService {
  constructor(
    @InjectRepository(Memo)
    private memoRepository: Repository<Memo>,
    private connection: Connection,
  ) {}

  findAll(): Promise<Memo[]> {
    return this.memoRepository.find();
  }

  findOne(id: string): Promise<Memo> {
    return this.memoRepository.findOne(id);
  }

  async createOne(createMemoDto: CreateMemoDto): Promise<Memo> {
    const memo = new Memo();
    memo.title = createMemoDto.title;
    memo.content = createMemoDto.content;

    return this.memoRepository.save(memo);
  }
}
