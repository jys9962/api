import { Module, OnModuleInit } from '@nestjs/common';
import { RedisModule } from '@/global/redis/redis.module';
import { NodeIdGetter } from '@/common/id-generator/internal/node-id-getter';
import { IdGenerator } from '@/common/id-generator/id-generator';
import Redis from 'ioredis';

const BASE_DATE = new Date('2020-01-01');

@Module({
  imports: [
    RedisModule,
  ],
  providers: [
    {
      provide: NodeIdGetter,
      useFactory: (
        redis: Redis,
      ) => new NodeIdGetter(
        redis,
        IdGenerator.getMaxNodeId(),
      ),
      inject: [Redis],
    },
  ],
})
export class IdGeneratorModule implements OnModuleInit {

  constructor(
    private readonly nodeIdGetter: NodeIdGetter,
  ) {}

  async onModuleInit() {
    const nodeId = await this.nodeIdGetter.get();
    IdGenerator.init(nodeId, BASE_DATE);
  }
}
