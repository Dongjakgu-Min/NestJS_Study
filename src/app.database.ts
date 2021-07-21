import { TypeOrmModule } from '@nestjs/typeorm';
import { Memo } from './memo/memo.entity';
import { User } from './user/user.entity';

const AppDatabase = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'nest',
  password: 'password',
  database: 'nest',
  entities: [Memo, User],
  synchronize: true,
});
export default AppDatabase;
