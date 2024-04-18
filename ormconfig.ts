import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '@/app.module';

export default NestFactory.create(AppModule)
  .then((app) => app.get(DataSource))
  .then((dataSource) => Promise.all([dataSource, dataSource.destroy()]))
  .then(([dataSource]) => dataSource);
