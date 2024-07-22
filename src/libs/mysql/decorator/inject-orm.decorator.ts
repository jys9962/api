import { Inject } from '@nestjs/common';
import { MysqlUtil } from '@/libs/mysql/util/mysql.util';

type EntityClass = Function
type Args1 = [string, EntityClass]
type Args2 = [EntityClass]

export function InjectOrm(
  name: string,
  entity: EntityClass,
): PropertyDecorator & ParameterDecorator

export function InjectOrm(
  entity: EntityClass,
): PropertyDecorator & ParameterDecorator

export function InjectOrm(
  ...args: Args1 | Args2
): PropertyDecorator & ParameterDecorator {
  const [name, entity] = (
    typeof args[0] === 'string'
      ? [args[0], args[1]]
      : ['default', args[0]]
  ) as [string, EntityClass];

  const provide = MysqlUtil.getName(name, entity);
  return Inject(provide);
}
