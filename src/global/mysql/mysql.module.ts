import { Module } from '@nestjs/common';
import { MemberEntity } from '@/global/mysql/entities/member.entity';
import { MysqlCoreModule } from '@/libs/mysql/mysql.core.module';
import { env } from '@/global/env';

const defaultEntities = [
  MemberEntity,
];

@Module({
  imports: [
    MysqlCoreModule.forRoot('default',
      {
        host: env.mysql.host,
        username: env.mysql.username,
        password: env.mysql.password,
        database: env.mysql.database,
      },
      defaultEntities,
    ),
  ],
  exports: [
    MysqlCoreModule,
  ],
})
export class MysqlModule {}
