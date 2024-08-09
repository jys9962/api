import { DynamoEntityBuilder } from '@/libs/dynamodb/model/dynamo-entity-builder';

export const MemberPointEntity = DynamoEntityBuilder
  .create({
    pk: 'memberPoint#{memberId}',
    sk: '#'
  })
  .with<{
    lastLogId: string;
    balance: number;
  }>()
  .build();

export type IMemberPointEntity = DynamoEntityBuilder.Type<typeof MemberPointEntity>
