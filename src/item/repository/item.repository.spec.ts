import { Test, TestingModule } from '@nestjs/testing';
import { initialiseTestTransactions, runInTransaction } from 'typeorm-test-transactions';
import { DatabaseModule } from '@/database/database.module';
import { AppModule } from '@/app.module';
import { INestApplication } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { ItemModule } from '../item.module';
import { CategoryRepository } from '@/category/repository/category.repository';
import { CategoryModule } from '@/category/category.module';
import { Category } from '@/category/entities/category.entity';

initialiseTestTransactions();

describe('ItemRepository', () => {
  let app: INestApplication;
  let categoryRepository: CategoryRepository;
  let itemRepository: ItemRepository;

  jest.setTimeout(60000);

  beforeAll(async () => {
    const module: TestingModule = await Test
      .createTestingModule({
        imports: [AppModule, DatabaseModule, CategoryModule, ItemModule],
      })
      .compile();

    app = module.createNestApplication();
    itemRepository = module.get<ItemRepository>(ItemRepository);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  afterAll(async () => await app.close());

  it('should save Item', async () => {

    runInTransaction(async () => {
      const category = await categoryRepository
        .save({
          name: 'electronics',
          parent: undefined,
          children: [] as Category[],
        });

      const item = await itemRepository
        .save({
          name: 'ps5',
          price: 19.50,
          category: category
        });

      expect(item)
        .toEqual(await itemRepository.findOne({ where: { id: item.id } }));
    });

  });

  it('should throw error as Item name exists', async () => {

    runInTransaction(async () => {
      const category = await categoryRepository
        .save({
          name: 'electronics',
          parent: undefined,
          children: [] as Category[],
        });

      await itemRepository
        .save({
          name: 'ps5',
          price: 19.50,
          category: category,
        });

      expect(
        await itemRepository
          .save({
            name: 'ps5',
            price: 10.50,
            category: category,
          }))
        .toThrow('');
    });

  });

});