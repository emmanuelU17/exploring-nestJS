import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../entities/category.entity';
import { runInTransaction } from 'typeorm-test-transactions';
import { CategoryRepository } from './category.repository';

describe('CategoryRepository', () => {
  let repository: CategoryRepository;

  jest.setTimeout(40_000);

  beforeEach(async () => {
    const module: TestingModule = await Test
      .createTestingModule({
        providers: [CategoryRepository],
      })
      .compile();

    console.log('module ', module);

    repository = module.get<CategoryRepository>(CategoryRepository);
    console.log('repository ', module);
  });

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

});