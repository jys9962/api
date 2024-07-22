import { SnowflakeIdGenerator } from '@/common/id-generator/internal/snowflake-id-generator';

export class IdGenerator {
  private static generator: SnowflakeIdGenerator;

  static init(
    nodeId: number,
    baseTime: Date,
  ) {
    this.generator = new SnowflakeIdGenerator(nodeId, baseTime);
  }

  static getMaxNodeId() {
    return SnowflakeIdGenerator.getMaxNodeId();
  }

  static nextId(): bigint {
    if (!this.generator) {
      throw Error('no init');
    }

    return this.generator.nextId();
  }
}
