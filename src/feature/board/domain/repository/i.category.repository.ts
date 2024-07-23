import { Category } from '@/feature/board/domain/category';

export abstract class ICategoryRepository {

  abstract find(categoryId: bigint): Promise<Category>

  abstract save(category: Category): Promise<void>

}
