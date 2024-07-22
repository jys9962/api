import { Email } from '@/common/value-object/email';
import { MemberPassword } from '@/feature/member/domain/value-object/member-password';
import { MemberName } from '@/feature/member/domain/value-object/member-name';
import { MemberId } from '@/feature/member/domain/value-object/member-id';

export class Member {

  constructor(
    public id: MemberId,
    public email: Email,
    public name: MemberName,
    public password: MemberPassword,
    public createdAt: Date,
  ) {}

  static create(
    email: string,
    name: string,
    password: string,
  ): Member {
    return new Member(
      MemberId.nextId(),
      Email.from(email),
      MemberName.from(name),
      MemberPassword.fromText(password),
      new Date(),
    );
  }

  isMatchPassword(password: string) {
    return this.password.isMatch(password);
  }
}
