import { Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { ExtendOrm } from '@/libs/mysql/interface/i.orm';

const extendFunctions = {

  async insertOrUpdate<TEntity extends ObjectLiteral>(
    this: Repository<TEntity>,
    itemOrArray: Partial<TEntity> | Partial<TEntity>[],
  ): Promise<void> {
    const updateColumns = this
      .metadata.nonVirtualColumns
      .filter(
        (column) => column.isPrimary,
      )
      .map(
        (column) => column.databaseName,
      );

    await this
      .createQueryBuilder()
      .insert()
      .values(itemOrArray)
      .orUpdate(updateColumns)
      .updateEntity(false)
      .execute();
  },

} satisfies ExtendOrm<any>;

export const extendTypeOrm = <TEntity extends ObjectLiteral>(
  repository: Repository<TEntity>,
) => repository.extend(extendFunctions);
