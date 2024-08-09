import { PointCommand } from '@/feature/point/domain/internal/command/point-command';
import { IPointCommandEntity, PointCommandEntity } from '@/feature/point/repository/entity/point-command.entity';
import { Timestamp } from '@/common/value-object/timestamp/timestamp';

export namespace PointCommandMapper {

  export const toPersistence = (
    memberId: bigint,
    pointCommand: PointCommand
  ): IPointCommandEntity => {
    return {
      pk: PointCommandEntity.key('pk', {
        memberId: memberId.toString()
      }),
      sk: PointCommandEntity.key('sk', {
        id: pointCommand.id.toString()
      }),
      amount: pointCommand.amount,
      createdAt: Timestamp.of(pointCommand.createdAt),
      type: pointCommand.type,
      expirationAt: pointCommand.expirationAt
        ? Timestamp.of(pointCommand.expirationAt)
        : undefined,
      transactionId: pointCommand.transactionId?.toString()
    };
  };

  export const toDomain = (
    entity: IPointCommandEntity
  ): PointCommand => {
    const fromEntity = PointCommandEntity.parse(entity);

    return new PointCommand(
      BigInt(fromEntity.sk.id),
      entity.amount,
      entity.type,
      new Date(entity.createdAt),
      fromEntity.transactionId ? BigInt(fromEntity.transactionId) : undefined,
      entity.expirationAt ? new Date(entity.expirationAt) : undefined
    );


  };


}
