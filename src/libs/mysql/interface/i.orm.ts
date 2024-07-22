import { Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';

export interface ExtendOrm<T> {

  /**
   * insert on duplicate update 쿼리 실행
   * duplicate update set 은 primary key 를 제외한 모든 컬럼
   *
   * @param itemOrArray T or T[]
   */
  insertOrUpdate(
    itemOrArray: Partial<T> | Partial<T>[],
  ): Promise<void>;
}

export type IOrm<T extends ObjectLiteral> = Repository<T> & ExtendOrm<T>
