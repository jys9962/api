import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class NodeIdGetter {

  constructor(
    private readonly redis: Redis,
    private readonly maxNodeId: number,
  ) {
  }

  async get() {
    const key = 'nodeId';
    const nodeId = await this.redis.incr(key) - 1;

    if (nodeId >= this.maxNodeId) {
      await this.redis.decrby(key, this.maxNodeId);
    }
    return nodeId % (this.maxNodeId + 1);
  }
}
