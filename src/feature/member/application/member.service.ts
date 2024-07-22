import { Injectable } from '@nestjs/common';
import { IMemberRepository } from '../domain/repository/i.member.repository';
import { Member } from '../domain/member';
import { SignUpDto } from './dto/sign-up.dto';
import { MemberId } from '@/feature/member/domain/value-object/member-id';
import { MemberSignedUpEvent } from '@/feature/member/domain/event/member-signed-up.event';
import { EventBus } from '@nestjs/cqrs';
import { SignInDto } from '@/feature/member/application/dto/sign-in.dto';
import { MemberSignedInEvent } from '@/feature/member/domain/event/member-signed-in.event';
import { Transactional } from 'typeorm-transactional';
import { ISignUpValidator } from '@/feature/member/domain/service/i.sign-up.validator';

@Injectable()
export class MemberService {

  constructor(
    private readonly memberRepository: IMemberRepository,
    private readonly signUpValidator: ISignUpValidator,
    private readonly eventBus: EventBus,
  ) {}

  async signIn(
    dto: SignInDto,
  ) {
    const member = await this.memberRepository.findByEmail(dto.email);
    if (!member) {
      throw Error();
    }

    const isMatchPassword = member.isMatchPassword(dto.password);
    if (!isMatchPassword) {
      throw Error();
    }

    this.eventBus.publish(
      new MemberSignedInEvent(member.id),
    );

    return this.signInMember(member);
  }

  @Transactional()
  async signUp(
    dto: SignUpDto,
  ): Promise<MemberId> {
    const member = Member.create(
      dto.email,
      dto.name,
      dto.password,
    );

    const isValid = await this.signUpValidator.isValid(member);
    if (!isValid) {
      throw Error();
    }

    await this.eventBus.publish(
      new MemberSignedUpEvent(
        member.id,
      ),
    );

    await this.memberRepository.save(member);

    return member.id;
  }


  private signInMember(member: Member) {

  }
}
