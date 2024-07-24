import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JsonInterceptor } from '@/common/interceptor/json.interceptor';
import { MysqlModule } from '@/global/mysql/mysql.module';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => {},
  addTransactionalDataSource: (t: any) => t,
}));

export const createModule = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      MysqlModule,
    ],
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useClass: JsonInterceptor,
      },
    ],
  }).compile();

  return moduleFixture;
};
