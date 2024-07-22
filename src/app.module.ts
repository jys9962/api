import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalMysqlModule } from '@/global/mysql/global-mysql.module';
import { MemberModule } from '@/feature/member/member.module';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from '@/global/redis/redis.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    GlobalMysqlModule,
    RedisModule.forRoot(),
    MemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
