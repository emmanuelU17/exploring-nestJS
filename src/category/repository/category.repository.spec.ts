import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../entities/category.entity';
import { initialiseTestTransactions, runInTransaction } from 'typeorm-test-transactions';
import { CategoryRepository } from './category.repository';
import { CategoryModule } from '../category.module';
import { DatabaseModule } from '../../database/database.module';
import { AppModule } from '../../app.module';
import { INestApplication } from '@nestjs/common';

initialiseTestTransactions();

describe('CategoryRepository', () => {
  let app: INestApplication;
  let repository: CategoryRepository;

  jest.setTimeout(60000);

  // Start the whole app as it connects to database.
  beforeAll(async () => {
    const module: TestingModule = await Test
      .createTestingModule({
        imports: [AppModule, DatabaseModule, CategoryModule],
      })
      .compile();

    app = module.createNestApplication();
    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  afterAll(async () => await app.close());

  it('should return found category', async () => {

    runInTransaction(async () => {
      const category = await repository
        .save({
          id: 1,
          name: 'electronics',
          parent: undefined,
          children: [] as Category[],
        });

      const found = await repository
        .categoryByName('electronics');

      expect(found).toEqual(category);
    });

  });

  it('should throw duplicate category name error', async () => {

    runInTransaction(async () => {
      await repository
        .save({
          name: 'electronics',
          parent: undefined,
          children: [] as Category[],
        });

      expect(
        await repository
          .save({
            name: 'electronics',
            parent: undefined,
            children: [] as Category[],
          }),
      ).toThrow('electronics exists');
    });

  });

  it('validate primary key generation type identity works', async () => {
    runInTransaction(async () => {
      await repository
        .save({
          name: 'electronics',
          parent: undefined,
          children: [] as Category[],
        });
      await repository
        .save({
          name: 'clothes',
          parent: undefined,
          children: [] as Category[],
        });
      await repository
        .save({
          name: 'toys',
          parent: undefined,
          children: [] as Category[],
        });

      const all: [Category[], number] = await repository.findAndCount();

      expect(all[1]).toEqual(3);
      expect(all[0][0].id).toEqual(1)
      expect(all[0][1].id).toEqual(2)
      expect(all[0][2].id).toEqual(3)
    });
  });

});