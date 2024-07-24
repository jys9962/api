import * as bcrypt from 'bcrypt';

export class MemberPassword {
  private static readonly SALT_ROUND = 10;

  constructor(
    readonly value: string,
  ) {}

  static fromText(value: string) {
    const hashed = bcrypt.hashSync(value, MemberPassword.SALT_ROUND)
    return new MemberPassword(hashed);
  };

  static fromHash(value: string) {
    return new MemberPassword(value);
  }

  isMatch(text: string): Promise<boolean> {
    return bcrypt.compare(text, this.value);
  }
}
