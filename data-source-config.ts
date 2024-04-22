import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { register } from 'tsconfig-paths';

config();

const service = new ConfigService();

register({
  baseUrl: __dirname,
  paths: {
    '@/*': ['src/*'],
  },
});

export const MY_APP_DATASOURCE = new DataSource({
  type: 'mysql',
  host: service.getOrThrow<string>('MYSQL_HOST'),
  port: service.getOrThrow<number>('MYSQL_PORT'),
  username: service.getOrThrow<string>('MYSQL_USERNAME'),
  password: service.getOrThrow<string>('MYSQL_PASSWORD'),
  database: service.getOrThrow<string>('MYSQL_DATABASE'),
  synchronize: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['migration/*.ts'],
});
