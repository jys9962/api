import { IArticleRepository } from '@/feature/board/domain/repository/i.article.repository';
import { Article } from '@/feature/board/domain/article';

export class MysqlArticleRepository implements IArticleRepository {

  find(articleId: bigint): Promise<Article> {
    return Promise.resolve(undefined) as any;
  }

}
