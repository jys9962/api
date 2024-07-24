import { Module } from '@nestjs/common';
import { MemberModule } from '@/feature/member/member.module';
import { MysqlModule } from '@/global/mysql/mysql.module';
import { ArticleService } from '@/feature/board/application/article.service';

@Module({
  imports: [
    MemberModule,
    MysqlModule,
  ],
  providers: [
    ArticleService,
  ],

})
export class BoardModule {}
