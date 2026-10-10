import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { HealthModule } from '@/modules/health/health.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res: { body: Record<string, unknown> }) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            status: 'ok',
            timestamp: expect.any(String),
            uptime: expect.any(Number),
          }),
        );
      });
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res: { body: Record<string, unknown> }) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            status: 'ok',
            timestamp: expect.any(String),
            uptime: expect.any(Number),
          }),
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
