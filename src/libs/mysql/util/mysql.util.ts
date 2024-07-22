export class MysqlUtil {

  static getName(
    connectionName: string,
    entity: Function,
  ) {
    return `@ORM/${connectionName}/${entity.name}`;
  }
}
