import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MySqlContainer } from '@testcontainers/mysql';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test')
      ? async () => {
        const container = await new MySqlContainer()
          .withUsername('explore')
          .withUserPassword('explore')
          .withRootPassword('explore')
          .withDatabase('explore_db')
          .start();

        const obj: DataSourceOptions = {
          type: 'mysql',
          host: container.getHost(),
          port: container.getPort(),
          username: container.getUsername(),
          password: container.getUserPassword(),
          database: container.getDatabase(),
          synchronize: false,
          entities: ['dist/**/*.entity.js'],
          migrations: ['dist/db/migration/*js'],
        };

        return obj;
      }
      : (service: ConfigService) => {
        const obj: DataSourceOptions = {
          type: 'mysql',
          host: service.getOrThrow<string>('MYSQL_HOST'),
          port: service.getOrThrow<number>('MYSQL_PORT'),
          username: service.getOrThrow<string>('MYSQL_USERNAME'),
          password: service.getOrThrow<string>('MYSQL_PASSWORD'),
          database: service.getOrThrow<string>('MYSQL_DATABASE'),
          synchronize: false, // Think of this as hibernate create-drop. default is false means we want to use migrations.
          entities: ['dist/**/*.entity.js'],
          migrations: ['dist/db/migration/*js'],
        };
        return obj;
      }
    }),
  ],
})
export class DatabaseModule {}
