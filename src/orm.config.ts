import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: '2002/al.23',
  database: 'cenais_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default config;
