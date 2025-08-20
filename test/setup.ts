import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import helmet from 'helmet';
import { CacheService } from 'src/core/cache/cache.service';
import { DatabaseService } from 'src/database/database.service';

let app: INestApplication;
let server: any;
let cacheService: CacheService;
let databaseService: DatabaseService;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(helmet());
  await app.init();
  server = app.getHttpServer();
  databaseService = app.get(DatabaseService);
  cacheService = app.get(CacheService);
});

afterEach(async () => {
  await cacheService.reset();
  await databaseService.reset();
});

afterAll(async () => {
  await app.close();
});

export { server };
