import { Module } from '@nestjs/common';
import { MembersEntity } from '@/global/mysql/entities/members.entity';
import { MysqlModule } from '@/libs/mysql/mysql.module';
import { env } from '@/global/env';

const defaultEntities = [
  MembersEntity,
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
