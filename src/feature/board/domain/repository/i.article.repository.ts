import { Article } from '@/feature/board/domain/article';

export abstract class IArticleRepository {

  abstract find(
    articleId: bigint,
  ): Promise<Article>


}
