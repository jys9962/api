import { Injectable } from '@nestjs/common';
import { Category } from '@/feature/board/domain/category';
import { ICategoryRepository } from '@/feature/board/domain/repository/i.category.repository';

@Injectable()
export class CategoryService {

  constructor(
    private readonly categoryRepository: ICategoryRepository,
  ) {}


  async save(
    boardId: bigint,
    name: string,
  ): Promise<bigint> {
    const category = Category.create(boardId, name);
    await this.categoryRepository.save(category);

    return category.id;
  }

  async find(
    categoryId: bigint,
  ): Promise<Category> {
    const category = await this.categoryRepository.find(categoryId);

    return category;
  }
}
