import { Controller } from '@nestjs/common';
import { ItemService } from '../service/item.service';

@Controller('item')
export class ItemController {

  constructor(private readonly service: ItemService) {}

}
