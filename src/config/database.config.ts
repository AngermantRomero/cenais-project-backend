import { DataSourceOptions } from 'typeorm';
import { Province } from '../provinces/entities/province.entity';

export const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Province],
  synchronize: false,
};
