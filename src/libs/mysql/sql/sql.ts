interface SqlResult {
  sql: string;
  params: any[];
}

const IS_SQL = Symbol('IS_SQL');
const isSql = (value: any): value is SqlResult => value[IS_SQL];
export const SQL = (
  strings: TemplateStringsArray,
  ...params: any[]
): SqlResult => {
  const result = {
    sql: '',
    params: [] as any[],
    [IS_SQL]: true,
  };

  for (let i = 0; i < strings.length - 1; i++) {
    const sqlPart = strings[i];
    const param = params[i];

    result.sql += sqlPart;
    if (isSql(param)) {
      result.sql += param.sql;
      result.params.push(...param.params);
    } else {
      result.sql += '?';
      result.params.push(param);
    }
  }

  result.sql += strings[strings.length - 1];
  return result;
};
