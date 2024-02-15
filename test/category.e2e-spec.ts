import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { API_PREFIX } from '@/util';
import { AppModule } from '@/app.module';
import { initialiseTestTransactions, runInTransaction } from 'typeorm-test-transactions';
import { Category } from '@/category/entities/category.entity';
import { CategoryRepository } from '@/category/repository/category.repository';

initialiseTestTransactions();

describe('CategoryController (e2e)', () => {
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
