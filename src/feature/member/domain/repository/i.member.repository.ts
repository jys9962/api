import { Member } from '../member';
import { MemberId } from '@/feature/member/domain/value-object/member-id';

export abstract class IMemberRepository {
  abstract findByEmail(email: string): Promise<Member | null>

  abstract exists(id: MemberId): Promise<boolean>

  abstract find(id: MemberId): Promise<Member>

  abstract save(member: Member): Promise<void>

}
