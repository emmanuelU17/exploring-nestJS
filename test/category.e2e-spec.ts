import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { CategoryRepository } from '@/category/repository/category.repository';
import { Category } from '@/category/entities/category.entity';
import { API_PREFIX } from '@/util';
import * as request from 'supertest';

describe('CategoryController (e2e) and Data Access Layer test', () => {
  let app: INestApplication;
  let repository: CategoryRepository;

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

  beforeEach(async () => await repository.queryRunner.startTransaction());

  afterEach(async () => await repository.queryRunner.rollbackTransaction());

  it('should save Category', async () => {
    const create = repository.create({
      name: 'electronics',
      parent: undefined,
    });
    await repository.save(create);

    const found = await repository.categoryByName('electronics');
    expect(found).toBeDefined();
  });

  it('should throw duplicate category name error', async () => {
    await repository.save({ name: 'electronics', parent: undefined });

    expect(
      await repository.save({ name: 'electronics', parent: undefined }),
    ).toThrow('electronics exists');
  });

  it('validate primary key generation type identity works', async () => {
    await repository.save({ name: 'electronics', parent: undefined });
    await repository.save({ name: 'clothes', parent: undefined });
    await repository.save({ name: 'toys', parent: undefined });

    const all: [Category[], number] = await repository.findAndCount();

    expect(all[1]).toEqual(3);
    expect(all[0][0].id).toEqual(1);
    expect(all[0][1].id).toEqual(2);
    expect(all[0][2].id).toEqual(3);
  });

  it('should update category ', async () => {
    // given
    const cat = await repository.save({
      name: 'electronics',
      parent: undefined,
    });

    // when
    await repository.updateByCategoryId({
      categoryId: cat.id,
      name: 'clothing',
    });

    const cur = await repository.findOneBy({ id: cat.id });

    // then
    expect(cur).toBeDefined();
    expect(cur.name).toEqual('clothing');
    expect(cur.parent).toBeUndefined();
  });

  it('should update category and parent id ', async () => {
    // given
    const cat = await repository.save({
      name: 'electronics',
      parent: undefined,
    });

    const clothes = await repository.save({ name: 'clothes', parent: cat });

    const collection = await repository.save({
      name: 'collection',
      parent: undefined,
    });

    // when
    await repository.updateByCategoryId({
      categoryId: clothes.id,
      name: 'house',
      parentId: collection.id,
    });
    const cur = await repository.findOneBy({ id: clothes.id });

    // then
    expect(cur).toBeDefined();
    expect(cur.name).toEqual('house');
    expect(cur.parent).toEqual(collection);
  });

  it(`${API_PREFIX}category (POST)`, async () => {
    await request(app.getHttpServer())
      .post(`${API_PREFIX}category`)
      .send({ name: 'electronics', parent_id: null })
      .expect(210)
      .expect({});
  });

  it(`${API_PREFIX}category (POST) should throw duplicate error`, async () => {
    await repository.save({
      name: 'electronics',
      parent: undefined,
    });

    await request(app.getHttpServer())
      .post(`${API_PREFIX}category`)
      .send({ name: 'electronics', parent_id: null })
      .expect(HttpStatus.CONFLICT)
      .expect({});
  });
});
