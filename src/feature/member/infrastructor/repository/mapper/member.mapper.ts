import { Member } from '@/feature/member/domain/member';
import { MembersEntity } from '@/global/mysql/entities/members.entity';
import { MemberId } from '@/feature/member/domain/value-object/member-id';
import { MemberName } from '@/feature/member/domain/value-object/member-name';
import { Email } from '@/common/value-object/email';
import { MemberPassword } from '@/feature/member/domain/value-object/member-password';

export class MemberMapper {

  static toPersistence(member: Member): MembersEntity {
    return new MembersEntity({
      id: member.id.toString(),
      createdAt: member.createdAt,
      name: member.name,
      email: member.email,
      password: member.password.value,
    });
  }

  static toDomain(entity: MembersEntity): Member {
    return new Member(
      MemberId.from(entity.id),
      Email.from(entity.email),
      MemberName.from(entity.name),
      MemberPassword.fromHash(entity.password),
      entity.createdAt,
    );
  }

}
