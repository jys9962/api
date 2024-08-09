import { DynamoEntityBuilder } from '@/libs/dynamodb/model/dynamo-entity-builder';
import { Timestamp } from '@/common/value-object/timestamp/timestamp';
import { DynamoEntity } from '@/libs/dynamodb/model/dynamo-entity';

describe(DynamoEntity.name, function() {
  const MemberEntity = DynamoEntityBuilder
    .create({
      pk: 'member#{memberId}',
      sk: `#`,
      gsi2pk: `group#{groupId}`,
      gsi2sk: 'member#{memberId}'
    })
    .with<{
      name: string
      birth: Timestamp
      isDeleted: boolean
      obj: {
        a: string
        b: number
        c: boolean
      }
      stringArr: string[]
      numberArr: number[]
    }>()
    .build();
  type MemberEntity = DynamoEntityBuilder.Type<typeof MemberEntity>


  it('엔티티 생성 및 파싱', async function() {
    const createParam = {
      pk: {
        memberId: '12345'
      },
      sk: {},
      gsi2pk: {
        groupId: '123'
      },
      gsi2sk: {
        memberId: '12345'
      },
      name: 'myName',
      birth: Timestamp.of(new Date(2020, 0, 1)),
      isDeleted: false,
      obj: {
        a: '111',
        b: 111,
        c: true
      },
      stringArr: ['a', 'b', 'c'],
      numberArr: [1, 2, 3, 4, 5]
    };
    const memberEntity: MemberEntity = MemberEntity.create(createParam);
    const expected: MemberEntity = {
      pk: 'member#12345' as any,
      sk: '#' as any,
      gsi2pk: `group#123` as any,
      gsi2sk: 'member#12345' as any,
      name: 'myName',
      birth: Timestamp.of(2020, 0, 1),
      isDeleted: false,
      obj: {
        a: '111',
        b: 111,
        c: true
      },
      stringArr: ['a', 'b', 'c'],
      numberArr: [1, 2, 3, 4, 5]
    };
    const fromEntity = MemberEntity.parse(memberEntity);

    expect(memberEntity).toStrictEqual(expected);
    expect(fromEntity).toStrictEqual(createParam);
  });

  it('키 생성', async function() {
    const pk = MemberEntity.key('pk', {
      memberId: '123'
    });

    expect(pk).toBe('member#123');
  });
});
