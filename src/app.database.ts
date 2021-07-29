import { TypeOrmModule } from '@nestjs/typeorm';
import { Memo } from './memo/memo.entity';
import { User } from './user/user.entity';
import { Auth } from './auth/auth.entity';

const AppDatabase = TypeOrmModule.forRoot({
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'nest',
  password: 'password',
  database: 'nest',
  entities: [Memo, User, Auth],
  synchronize: true,
});
export default AppDatabase;
