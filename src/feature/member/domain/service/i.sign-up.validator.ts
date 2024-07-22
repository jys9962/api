import { Member } from '@/feature/member/domain/member';

export abstract class ISignUpValidator {
  abstract isValid(member: Member): Promise<boolean>
}
