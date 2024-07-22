import { MemberName } from '@/feature/member/domain/value-object/member-name';

describe('MemberName', () => {

  it('회원명', async function() {
    // given
    const nameText = 'AlejandroPan';

    // when
    const memberName = MemberName.from(nameText);

    // then
    expect(typeof memberName).toBe('string');
  });

});
