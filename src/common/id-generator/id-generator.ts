import { SnowflakeIdGenerator } from '@/common/id-generator/internal/snowflake-id-generator';
import { env } from '@/global/env';
import { v4 as uuidv4 } from 'uuid';

export class IdGenerator {
  private static generator: SnowflakeIdGenerator;

  static init(
    nodeId: number,
    baseTime: Date
  ) {
    this.generator = new SnowflakeIdGenerator(nodeId, baseTime);
  }

  static getMaxNodeId() {
    return SnowflakeIdGenerator.getMaxNodeId();
  }

  static nextId(): bigint {
    if (!this.generator && env.isTest) {
      this.generator = new SnowflakeIdGenerator(0, new Date(2020, 0, 1));
    }

    if (!this.generator) {
      throw Error('no init');
    }

    return this.generator.nextId();
  }

  static uuid() {
    return uuidv4()
  }
}
