import { MemberPointRepository } from '@/feature/point/domain/member-point.repository';
import { MemberPoint } from '@/feature/point/domain/member-point';
import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoUtil } from '@/libs/dynamodb/util/dynamo-util';
import { PointLogEntity } from '@/feature/point/repository/entity/point-log.entity';
import { PointLogMapper } from '@/feature/point/repository/mapper/point-log.mapper';
import { MemberPointEntity } from '@/feature/point/repository/entity/member-point.entity';
import { BigIntMath } from '@/common/util/bigint/big-math';
import { MemberPointMapper } from '@/feature/point/repository/mapper/member-point.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberPointRepositoryImpl implements MemberPointRepository {

  constructor(
    private readonly dynamoClient: DynamoDBDocumentClient,
  ) {}

  async find(
    memberId: bigint,
  ): Promise<MemberPoint> {
    const { Items } = await this.dynamoClient.send(
      new QueryCommand({
        TableName: 'api',
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': DynamoUtil.createKey(PointLogEntity.pk, {
            memberId: memberId.toString(),
          }),
        },
        ConsistentRead: true
      }),
    );

    if (!Items || Items.length === 0) {
      return MemberPoint.create();
    }

    const logList = Items as PointLogEntity[];

    return logList
      .sort(
        (
          t1,
          t2,
        ) => t1.createdAt - t2.createdAt,
      )
      .reduce(
        (
          memberPoint,
          log,
        ) => {
          const pointLog = PointLogMapper.toDomain(log);

          return memberPoint.execute(pointLog);
        },
        MemberPoint.create(new Date(0)),
      );
  }

  async save(
    memberId: bigint,
    memberPoint: MemberPoint,
  ): Promise<void> {
    const newLogEntityList = memberPoint
      .commandList
      .filter(t => t.isNew)
      .map(
        t => PointLogMapper.toPersistence(memberId, t),
      );

    if (newLogEntityList.length === 0) {
      return;
    }

    const lastLogId = BigIntMath.max(
      0n,
      ...memberPoint
        .commandList
        .filter(t => !t.isNew)
        .map(t => t.id),
    );

    await this.dynamoClient.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: 'api',
              Item: MemberPointMapper.toPersistence(memberId, memberPoint),
              ConditionExpression: `
                attribute_not_exists(pk) OR 
                lastLogId = :lastIdValue
              `,
              ExpressionAttributeValues: {
                ':lastIdValue': lastLogId.toString(),
              },
            },
          },
          ...newLogEntityList.map(
            t => ({
              Put: {
                TableName: 'api',
                Item: t,
              },
            }),
          ),
        ],
      }),
    );
  }

}
