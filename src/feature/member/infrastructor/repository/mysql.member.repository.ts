import { Injectable } from '@nestjs/common';
import { IMemberRepository } from '@/feature/member/domain/repository/i.member.repository';
import { MemberId } from '@/feature/member/domain/value-object/member-id';
import { Member } from '@/feature/member/domain/member';
import { InjectOrm } from '@/libs/mysql/decorator/inject-orm.decorator';
import { MemberEntity } from '@/global/mysql/entities/member.entity';
import { IOrm } from '@/libs/mysql/interface/i.orm';
import { MemberMapper } from '@/feature/member/infrastructor/repository/mapper/member.mapper';

@Injectable()
export class MysqlMemberRepository implements IMemberRepository {

  constructor(
    @InjectOrm(MemberEntity)
    private readonly memberOrm: IOrm<MemberEntity>,
  ) {}

  async exists(id: MemberId): Promise<boolean> {
    return this.memberOrm.exists({
      where: {
        id: id.toString(),
      },
    });
  }

  async find(id: MemberId): Promise<Member> {
    const member = await this.memberOrm.findOneBy({
      id: id.toString(),
    });

    if (!member) {
      throw Error();
    }

    return MemberMapper.toDomain(member);
  }

  async findByEmail(email: string): Promise<Member | null> {
    const memberEntity = await this.memberOrm.findOne({
      where: { email: email },
    });

    if (!memberEntity) {
      throw Error();
    }

    return MemberMapper.toDomain(memberEntity);
  }

  async save(member: Member): Promise<void> {
    const entity = MemberMapper.toPersistence(member);
    await this.memberOrm.insertOrUpdate(entity);
  }

}
