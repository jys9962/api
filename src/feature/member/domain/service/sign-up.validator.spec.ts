import { Test, TestingModule } from '@nestjs/testing';
import { IMemberRepository } from '@/feature/member/domain/repository/i.member.repository';
import { Member } from '@/feature/member/domain/member';
import { SignUpValidator } from '@/feature/member/domain/service/sign-up.validator';
import { MemberId } from '@/feature/member/domain/value-object/member-id';
import { Email } from '@/common/value-object/email/email';
import { MemberName } from '@/feature/member/domain/value-object/member-name';
import { MemberPassword } from '@/feature/member/domain/value-object/member-password';

function fixture(props: Partial<Member>): Member {
  return new Member(
    props.id ?? MemberId.nextId(),
    props.email ?? Email.from('test@test.test'),
    props.name ?? MemberName.from('test'),
    props.password ?? MemberPassword.fromText('123456'),
    props.createdAt ?? new Date(),
  );
}


describe('SignUpValidator', () => {
  let signUpValidator: SignUpValidator;
  let memberRepository: IMemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpValidator,
        {
          provide: IMemberRepository,
          useValue: {
            exist: jest.fn(),
          },
        },
      ],
    }).compile();

    signUpValidator = module.get<SignUpValidator>(SignUpValidator);
    memberRepository = module.get<IMemberRepository>(IMemberRepository);
  });

  it('should return true if member does not exist', async () => {
    const member = fixture({
      id: MemberId.from(1n),
    });
    jest.spyOn(memberRepository, 'exists').mockResolvedValue(false);

    const result = await signUpValidator.isValid(member);
    expect(result).toBe(true);
    expect(memberRepository.exists).toHaveBeenCalledWith(member.id);
  });

  it('should return false if member exists', async () => {
    const member = fixture({
      id: MemberId.from(2n),
    });
    jest.spyOn(memberRepository, 'exists').mockResolvedValue(true);

    const result = await signUpValidator.isValid(member);
    expect(result).toBe(false);
    expect(memberRepository.exists).toHaveBeenCalledWith(member.id);
  });
});
