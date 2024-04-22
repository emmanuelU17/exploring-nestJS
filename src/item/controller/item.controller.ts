import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ItemService } from '../service/item.service';
import { API_PREFIX } from '@/util';

@Controller(`${API_PREFIX}item`)
export class ItemController {
  constructor(private readonly service: ItemService) {}

  @Get()
  @HttpCode(HttpStatus.OK.valueOf())
  async hello(): Promise<string> {
    return 'Hello World!';
  }
}
