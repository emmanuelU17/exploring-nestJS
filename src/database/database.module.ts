import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MySqlContainer } from '@testcontainers/mysql';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (service: ConfigService) => {
        if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
          const container = await new MySqlContainer()
            .withUsername('explore')
            .withUserPassword('explore')
            .withRootPassword('explore')
            .withDatabase('explore_db')
            .start();

          process.env.MYSQL_HOST = container.getHost();
          process.env.MYSQL_PORT = container.getPort().toString();
          process.env.MYSQL_USERNAME = container.getUsername();
          process.env.MYSQL_PASSWORD = container.getUserPassword();
          process.env.MYSQL_DATABASE = container.getDatabase();
        }

        const obj: DataSourceOptions = {
          type: 'mysql',
          host: service.getOrThrow<string>('MYSQL_HOST'),
          port: service.getOrThrow<number>('MYSQL_PORT'),
          username: service.getOrThrow<string>('MYSQL_USERNAME'),
          password: service.getOrThrow<string>('MYSQL_PASSWORD'),
          database: service.getOrThrow<string>('MYSQL_DATABASE'),
          synchronize: false, // think of this as hibernate create-drop. default is false means we want to use migrations.
          entities: ['dist/**/*.entity.js'],
          migrations: ['dist/migration/*js'],
        };
        return obj;
      },
      dataSourceFactory: async (options) => {
        console.log('datasource options ', options);
        // process.env.MYSQL_HOST = options.;
        // process.env.MYSQL_PORT = container.getPort().toString();
        // process.env.MYSQL_USERNAME = container.getUsername();
        // process.env.MYSQL_PASSWORD = container.getUserPassword();
        // process.env.MYSQL_DATABASE = container.getDatabase();
        return await new DataSource(options).initialize();
      },
    }),
  ],
})
export class DatabaseModule {}
