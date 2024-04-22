import { register } from 'tsconfig-paths';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const resolver = () =>
  register({
    baseUrl: __dirname,
    paths: {
      '@/*': ['src/*'],
    },
  });

export class TestHelper {
  public static async datasource(service: ConfigService) {
    resolver();
    return new DataSource({
      type: 'mysql',
      host: service.getOrThrow<string>('MYSQL_HOST'),
      port: service.getOrThrow<number>('MYSQL_PORT'),
      username: service.getOrThrow<string>('MYSQL_USERNAME'),
      password: service.getOrThrow<string>('MYSQL_PASSWORD'),
      database: service.getOrThrow<string>('MYSQL_DATABASE'),
      synchronize: false,
      migrationsRun: true,
      entities: ['src/**/*.entity.ts'],
      migrations: ['migration/*.ts'],
    });
  }

  /**
   * My custom implementation for database rollback.
   * */
  public static async clearDatabase(
    source: DataSource,
    database: string,
  ): Promise<void> {
    await source.query(`DROP DATABASE IF EXISTS ${database};`);
    await source.query(`CREATE DATABASE IF NOT EXISTS ${database};`);
  }
}
