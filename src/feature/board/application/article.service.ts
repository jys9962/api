import { Injectable } from '@nestjs/common';
import { IArticleRepository } from '@/feature/board/domain/repository/i.article.repository';
import { Article } from '@/feature/board/domain/article';

@Injectable()
export class ArticleService {

  constructor(
    private readonly articleRepository: IArticleRepository,
  ) {}

  writeArticle() {
    const article = Article.create()
  }

}
