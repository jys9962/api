import { PointCommand } from '@/feature/point/domain/internal/log/point-command';
import { PointLogEntity } from '@/feature/point/repository/entity/point-log.entity';
import { DynamoUtil } from '@/libs/dynamodb/util/dynamo-util';
import { Timestamp } from '@/common/type/timestamp';

export namespace PointLogMapper {

  export const toPersistence = (
    memberId: bigint,
    pointLog: PointCommand,
  ): PointLogEntity => {
    return {
      pk: DynamoUtil.createKey(PointLogEntity.pk, {
        memberId: memberId.toString(),
      }),
      sk: DynamoUtil.createKey(PointLogEntity.sk, {
        id: pointLog.id.toString(),
      }),
      amount: pointLog.amount,
      createdAt: Timestamp.of(pointLog.createdAt),
      type: pointLog.type,
      expirationAt: pointLog.expirationAt
        ? Timestamp.of(pointLog.expirationAt)
        : undefined,
      transactionId: pointLog.transactionId,
    };
  };

  export const toDomain = (
    entity: PointLogEntity,
  ): PointCommand => {

    const fromPk = DynamoUtil.parseKey(PointLogEntity.pk, entity.pk);
    const fromSk = DynamoUtil.parseKey(PointLogEntity.sk, entity.sk);

    return new PointCommand(
      BigInt(fromSk.id),
      entity.amount,
      entity.type,
      new Date(entity.createdAt),
      entity.transactionId,
      entity.expirationAt ? new Date(entity.expirationAt) : undefined,
    );


  };


}
