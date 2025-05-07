import { DataSourceOptions } from 'typeorm';
import { Province } from 'src/provinces/entities/province.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { Sites } from 'src/sites/entities/sites.entity';
import { User } from 'src/users/entities/user.entity';

export const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Province, Role, Sites, User],
  synchronize: false,
};
