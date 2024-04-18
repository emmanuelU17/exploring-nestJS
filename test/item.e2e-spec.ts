import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { API_PREFIX } from '@/util';
import * as request from 'supertest';

describe('ItemController test', () => {
  let app: INestApplication;

  jest.setTimeout(6000000);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => await app.close());

  it(`${API_PREFIX}item (get) should return hello world`, async () => {
    await request(app.getHttpServer())
      .get(`${API_PREFIX}item`)
      .expect(HttpStatus.OK)
      .expect('Hello World!');
  });

});