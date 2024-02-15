import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CategoryModule } from '../src/category/category.module';
import { API_PREFIX } from '../src/util';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoryModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`${API_PREFIX} (GET)`, () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
