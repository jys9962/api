import { MemberPassword } from '@/feature/member/domain/value-object/member-password';

describe('MemberPassword', () => {

  it('패스워드 암호화 & 확인', async function() {
    // given
    const passwordText: string = '10308b9e-d98b-4d51-b383-dfef5e9dd376';

    // when
    const memberPassword = MemberPassword.fromText(passwordText);

    // then
    expect(memberPassword.value).not.toBe(passwordText);
    expect(memberPassword.isMatch(passwordText)).toBeTruthy();
  });

});
