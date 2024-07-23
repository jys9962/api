import { Module } from '@nestjs/common';
import { MemberModule } from '@/feature/member/member.module';
import { GlobalMysqlModule } from '@/global/mysql/global-mysql.module';
import { ArticleService } from '@/feature/board/application/article.service';

@Module({
  imports: [
    MemberModule,
    GlobalMysqlModule,
  ],
  providers: [
    ArticleService,
  ],

})
export class BoardModule {}
