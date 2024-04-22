import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (service: ConfigService) => {
        return {
          type: 'mysql',
          host: service.getOrThrow<string>('MYSQL_HOST'),
          port: service.getOrThrow<number>('MYSQL_PORT'),
          username: service.getOrThrow<string>('MYSQL_USERNAME'),
          password: service.getOrThrow<string>('MYSQL_PASSWORD'),
          database: service.getOrThrow<string>('MYSQL_DATABASE'),
          synchronize: false, // think of this as hibernate create-drop. default is false means we want to use migrations.
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          migrations: [__dirname + '/migrations/*.{js,ts}'],
        } as DataSourceOptions;
      },
      dataSourceFactory: async (options) =>
        await new DataSource(options).initialize(),
    }),
  ],
})
export class DatabaseModule {}
