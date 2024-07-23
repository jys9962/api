import { Module } from '@nestjs/common';
import { MemberEntity } from '@/global/mysql/entities/member.entity';
import { MysqlModule } from '@/libs/mysql/mysql.module';
import { env } from '@/global/env';

const defaultEntities = [
  MemberEntity,
];

@Module({
  imports: [
    MysqlModule.forRoot('default',
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
    MysqlModule,
  ],
})
export class GlobalMysqlModule {}
