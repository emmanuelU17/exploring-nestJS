import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const service = new ConfigService();

export const source = new DataSource({
  type: 'mysql',
  host: service.getOrThrow<string>('MYSQL_HOST'),
  port: service.getOrThrow<number>('MYSQL_PORT'),
  username: service.getOrThrow<string>('MYSQL_USERNAME'),
  password: service.getOrThrow<string>('MYSQL_PASSWORD'),
  database: service.getOrThrow<string>('MYSQL_DATABASE'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migration/*js'],
});
