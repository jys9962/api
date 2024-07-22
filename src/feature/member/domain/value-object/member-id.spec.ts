import { MemberId } from '@/feature/member/domain/value-object/member-id';

describe('MemberId', () => {

  it('아이디 생성', async function() {
    // when
    const nextId = MemberId.nextId();

    // then
    expect(nextId).toBeDefined();
    expect(typeof nextId).toBe('bigint');
  });

});
