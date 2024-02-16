import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { API_PREFIX } from '@/util';
import { AppModule } from '@/app.module';
import { initialiseTestTransactions, runInTransaction } from 'typeorm-test-transactions';
import { Category } from '@/category/entities/category.entity';
import { CategoryRepository } from '@/category/repository/category.repository';

initialiseTestTransactions();

describe('CategoryController (e2e) and Data Access Layer test', () => {
  let app: INestApplication;
  let repository: CategoryRepository;

  jest.setTimeout(60000);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    repository = module.get<CategoryRepository>(CategoryRepository);

    await app.init();
  });

  afterAll(async () => await app.close());

  it('should save Category', async () => {

    runInTransaction(async () => {
      const category = await repository
        .save({
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

  it(`${API_PREFIX}category (POST)`, async () => {
    runInTransaction(async () => {
      await request(app.getHttpServer())
        .post(`${API_PREFIX}category`)
        .send({ name: 'electronics', parent_id: null })
        .expect(210)
        .expect({});
    })
  });

  it(`${API_PREFIX}category (POST) should throw duplicate error`, async () => {
    runInTransaction(async () => {
      await repository
        .save({
          name: 'electronics',
          parent: undefined,
          children: [] as Category[],
        });

      await request(app.getHttpServer())
        .post(`${API_PREFIX}category`)
        .send({ name: 'electronics', parent_id: null })
        .expect(210)
        .expect({});
    })
  });

});
