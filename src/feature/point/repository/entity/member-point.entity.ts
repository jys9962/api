import { Dynamo } from '@/libs/dynamodb/type/dynamo.type';

export interface MemberPointEntity {
  pk: Dynamo.Key<MemberPointEntity.pk>;
  sk: Dynamo.Key<MemberPointEntity.sk>;

  lastLogId: string;
  balance: number;
}

export namespace MemberPointEntity {
  export const pk = 'memberPoint#{memberId}';
  export const sk = '#';

  export type pk = typeof pk
  export type sk = typeof sk
}
