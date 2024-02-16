import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MySqlContainer } from '@testcontainers/mysql';

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

          return {
            type: 'mysql',
            host: container.getHost(),
            port: container.getPort(),
            username: container.getUsername(),
            password: container.getUserPassword(),
            database: container.getDatabase(),
            synchronize: true,
            autoLoadEntities: true,
          };
        }
        : (service: ConfigService) => ({
          type: 'mysql',
          host: service.getOrThrow<string>('MYSQL_HOST'),
          port: service.getOrThrow<number>('MYSQL_PORT'),
          username: service.getOrThrow<string>('MYSQL_USERNAME'),
          password: service.getOrThrow<string>('MYSQL_PASSWORD'),
          database: service.getOrThrow<string>('MYSQL_DATABASE'),
          synchronize: true,
          autoLoadEntities: true,
        }),
    }),
  ],
})
export class DatabaseModule {}
