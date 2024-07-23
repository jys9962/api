import { SQL } from '@/libs/mysql/sql/sql';


describe('SQL', () => {
  it('파라미터 없는 경우', async function() {
    const { sql, params } = SQL`select 123`;

    expect(sql).toBe('select 123');
    expect(params).toStrictEqual([]);
  });

  it('파라미터 하나 있는 경우', async function() {
    const { sql, params } = SQL`select ${'aaa'}`;

    expect(sql).toBe('select ?');
    expect(params).toStrictEqual(['aaa']);
  });

  it('파라미터 여러개 있는 경우', async function() {
    const { sql, params } = SQL`select ${'aaa'} as a, ${'bbb'} as b`;

    expect(sql).toBe('select ? as a, ? as b');
    expect(params).toStrictEqual(['aaa', 'bbb']);
  });

  it('쿼리 안에 쿼리가 있는 경우', async function() {
    const {sql, params} = SQL`select ${'aaa'} as a, ${SQL`${'bbb'} as b`}, ${'ccc'} as c`

    expect(sql).toBe(`select ? as a, ? as b, ? as c`)
    expect(params).toStrictEqual(['aaa', 'bbb', 'ccc'])
  });

});
