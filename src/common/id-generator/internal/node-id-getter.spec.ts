import Redis from 'ioredis';
import { NodeIdGetter } from './node-id-getter';

describe('NodeIdGetter', () => {
  let redis: Redis;

  beforeAll(async () => {
    // 실제 Redis 서버와 연결
    redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  });

  afterAll(async () => {
    // 테스트 후 Redis 연결 종료
    await redis.quit();
  });

  beforeEach(async () => {
    // 테스트 전에 Redis 키 초기화
    await redis.del('nodeId');
  });

  it('기본 테스트', async function() {
    const count = 20;
    const sut = new NodeIdGetter(redis, 9);

    const ids = await Promise.all(
      Array
        .from({ length: count })
        .map(() => sut.get()),
    );
    const expected = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ];

    expect(ids).toStrictEqual(expected);
  });

  it('최대값 테스트', async function() {
    const sut = new NodeIdGetter(redis, 10);

    for (let i = 0; i < 100; i++) {
      const id = await sut.get();
      expect(id <= 10).toBe(true);
    }
  });

  it('동시호출 테스트', async () => {
    const requestCount = 100;
    const sut = new NodeIdGetter(redis, 100);

    const ids = await Promise.all(
      Array.from({ length: requestCount })
           .map(() => sut.get()),
    );

    const distinctSize = new Set(ids).size;
    expect(distinctSize).toBe(requestCount);
  });

});
