import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const service = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: service.getOrThrow<string>('MYSQL_HOST'),
  port: service.getOrThrow<number>('MYSQL_PORT'),
  username: service.getOrThrow<string>('MYSQL_USERNAME'),
  password: service.getOrThrow<string>('MYSQL_PASSWORD'),
  database: service.getOrThrow<string>('MYSQL_DATABASE'),
  synchronize: false, // Think of this as hibernate create-drop. default is false means we want to use migrations.
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migration/*js'],
});