import { Injectable } from '@nestjs/common';
import { ItemRepository } from '@/item/repository/item.repository';

@Injectable()
export class ItemService {
  constructor(private readonly repository: ItemRepository) {}
}
