import { Injectable } from '@nestjs/common';
import { IMemberRepository } from '@/feature/member/domain/repository/i.member.repository';
import { Member } from '@/feature/member/domain/member';
import { ISignUpValidator } from '@/feature/member/domain/service/i.sign-up.validator';

@Injectable()
export class SignUpValidator implements ISignUpValidator {

  constructor(
    private readonly memberRepository: IMemberRepository,
  ) {}

  async isValid(member: Member): Promise<boolean> {
    const isExist = await this.memberRepository.exists(member.id);
    if (isExist) {
      return false;
    }

    return true;
  }


}
