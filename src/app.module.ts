import { Module } from '@nestjs/common';
import { GlobalMysqlModule } from '@/global/mysql/global-mysql.module';
import { MemberModule } from '@/feature/member/member.module';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from '@/global/redis/redis.module';
import { IdGeneratorModule } from '@/common/id-generator/id-generator.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JsonInterceptor } from '@/common/interceptor/json.interceptor';

@Module({
  imports: [
    CqrsModule.forRoot(),
    GlobalMysqlModule,
    RedisModule.forRoot(),
    MemberModule,
    IdGeneratorModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: JsonInterceptor,
    },
  ],
})
export class AppModule {}
