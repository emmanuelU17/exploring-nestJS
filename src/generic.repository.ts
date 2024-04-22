import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, Repository } from 'typeorm';

@Injectable()
export class GenericRepository<T> extends Repository<T> {
  constructor(
    protected readonly dataSource: DataSource,
    entity: EntityTarget<T>,
  ) {
    super(
      entity,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }
}
