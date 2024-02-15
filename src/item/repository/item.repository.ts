import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemRepository extends Repository<Item> {

  constructor(
    @InjectRepository(Item)
    private readonly repository: Repository<Item>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }


}