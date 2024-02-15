import { Module } from '@nestjs/common';
import { ItemService } from './service/item.service';
import { ItemController } from './controller/item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/category/entities/category.entity';
import { Item } from '@/item/entities/item.entity';
import { ItemRepository } from '@/item/repository/item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category])],
  controllers: [ItemController],
  providers: [ItemService, ItemRepository],
})
export class ItemModule {}