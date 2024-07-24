import { Module } from '@nestjs/common';
import { MemberController } from '@/feature/member/interface/member.controller';
import { MemberService } from '@/feature/member/application/member.service';
import { IMemberRepository } from '@/feature/member/domain/repository/i.member.repository';
import { MysqlMemberRepository } from '@/feature/member/infrastructor/repository/mysql.member.repository';
import { SignUpValidator } from '@/feature/member/domain/service/sign-up.validator';
import { MysqlModule } from '@/global/mysql/mysql.module';
import { RedisModule } from '@/global/redis/redis.module';
import { ISignUpValidator } from '@/feature/member/domain/service/i.sign-up.validator';
import { DynamodbModule } from '@/global/dynamodb/dynamodb.module';

const domain = [
  {
    provide: ISignUpValidator,
    useClass: SignUpValidator,
  },
  {
    provide: IMemberRepository,
    useClass: MysqlMemberRepository,
  },
];

const application = [
  MemberService,
];

@Module({
  imports: [
    MysqlModule,
    DynamodbModule,
    RedisModule,
  ],
  controllers: [
    MemberController,
  ],
  providers: [
    ...domain,
    ...application,
  ],
})
export class MemberModule {}
