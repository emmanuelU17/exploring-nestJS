import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { CategoryRepository } from '@/category/category.repository';
import { TestHelper } from './index';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { API_PREFIX } from '@/util';
import * as request from 'supertest';

describe('CategoryController (e2e) and Data Access Layer test', () => {
  let app: INestApplication;
  let repository: CategoryRepository;
  let source: DataSource;

  jest.setTimeout(6000000);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    repository = module.get<CategoryRepository>(CategoryRepository);

    await app.init();
  });

  afterAll(async () => await app.close());

  beforeEach(async () => {
    source = await TestHelper.datasource(new ConfigService());
    await source.initialize();
  });

  afterEach(async () => {
    await TestHelper.clearDatabase(source, 'explore_db');
    await source.destroy();
  });

  it('should save Category', async () => {
    const create = repository.create({ name: 'electronics' });
    await repository.save(create);

    const found = await repository.categoryByName('electronics');
    expect(found).toBeDefined();
  });

  it('should throw duplicate category name error', async () => {
    await repository.save({ name: 'electronics' });
    try {
      await repository.save({ name: 'electronics' });
    } catch (e) {
      expect(e.message).toEqual(
        `Duplicate entry 'electronics' for key 'category.name'`,
      );
    }
  });

  it('should update category', async () => {
    // given
    await repository.save(repository.create({ name: 'electronics' }));

    const cat = await repository.categoryByName('electronics');

    // method to test
    await repository.updateByCategoryId({
      categoryId: cat.category_id,
      name: 'clothing',
      parentId: null,
    });

    const cur = await repository.categoryByName('clothing');

    // then
    expect(cur).toBeDefined();
    expect(cur.name).toEqual('clothing');
    expect(cur.parent_id).toBeNull();
  });

  it('should update category and parent id ', async () => {
    // given
    await repository.save(repository.create({ name: 'electronics' }));
    await repository.save(repository.create({ name: 'clothes' }));
    await repository.save(repository.create({ name: 'collection' }));

    // when
    const clothes = await repository.categoryByName('clothes');
    const collection = await repository.categoryByName('collection');

    // method to test
    await repository.updateByCategoryId({
      categoryId: clothes.category_id,
      name: 'house',
      parentId: collection.category_id,
    });

    const cur = await repository.categoryByName('house');

    // then
    expect(cur).toBeDefined();
    expect(cur.name).toEqual('house');
    expect(cur.parent_id).toEqual(collection.category_id);
  });

  it(`${API_PREFIX}category (POST)`, async () => {
    await request(app.getHttpServer())
      .post(`${API_PREFIX}category`)
      .send({ name: 'electronics' })
      .expect(HttpStatus.CREATED)
      .expect({});
  });

  it(`${API_PREFIX}category (POST) should throw duplicate error`, async () => {
    await repository.save(repository.create({ name: 'electronics' }));

    await request(app.getHttpServer())
      .post(`${API_PREFIX}category`)
      .send({ name: 'electronics' })
      .expect(HttpStatus.CONFLICT);
  });

  it(`${API_PREFIX}category (PUT) should successfully update with parent not existing`, async () => {
    await repository.save(repository.create({ name: 'electronics' }));
    const obj = await repository.categoryByName('electronics');

    await request(app.getHttpServer())
      .put(`${API_PREFIX}category`)
      .send({ name: 'frog', categoryId: obj.category_id, parentId: null })
      .expect(HttpStatus.NO_CONTENT);
  });

  it(`${API_PREFIX}category (PUT) should successfully update with parent existing`, async () => {
    // given
    await repository.save(repository.create({ name: 'electronics' }));
    await repository.save(repository.create({ name: 'fan' }));

    const obj = await repository.categoryByName('electronics');
    const fan = await repository.categoryByName('fan');

    // api call
    await request(app.getHttpServer())
      .put(`${API_PREFIX}category`)
      .send({
        name: 'tv',
        categoryId: fan.category_id,
        parentId: obj.category_id,
      })
      .expect(HttpStatus.NO_CONTENT);
  });
});
