import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Memo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column({ default: false })
  isDeleted: boolean;
}
