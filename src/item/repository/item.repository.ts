import { Injectable } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ItemRepository extends Repository<Item> {
  constructor(dataSource: DataSource) {
    super(
      Item,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }
}
