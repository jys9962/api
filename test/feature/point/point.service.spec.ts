import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { MemberPointRepository } from '@/feature/point/domain/member-point.repository';
import { PointService } from '@/feature/point/service/point.service';
import { MemberPointRepositoryImpl } from '@/feature/point/repository/member-point.repository.impl';
import { Timestamp } from '@/common/value-object/timestamp/timestamp';
import { DynamoTest } from '../../fixture/dynamo.fixture';
import { IdGenerator } from '@/common/id-generator/id-generator';

describe('PointService (Integration)', function() {
  let service: PointService;
  let dynamoClient: DynamoDBDocumentClient;

  beforeAll(async function() {
    const module: TestingModule = await Test
      .createTestingModule({
        providers: [
          PointService,
          {
            provide: MemberPointRepository,
            useClass: MemberPointRepositoryImpl
          },
          {
            provide: DynamoDBDocumentClient,
            useFactory: () => DynamoDBDocumentClient.from(
              new DynamoDBClient({
                endpoint: 'http://localhost:8000',
                region: IdGenerator.uuid(),
                credentials: {
                  accessKeyId: 'd1ncg',
                  secretAccessKey: 'wfr6bm'
                }
              })
            )
          }
        ]
      })
      .compile();

    service = module.get<PointService>(PointService);
    dynamoClient = module.get<DynamoDBDocumentClient>(DynamoDBDocumentClient);
  });

  beforeEach(async function() {
    await DynamoTest.createTable(dynamoClient);
  });

  afterEach(async () => {
    await DynamoTest.deleteTable(dynamoClient);
  });

  it('포인트 지급', async function() {
    const memberId = 123n;
    const amount = 1000;
    const expirationAt = new Date(Date.now() + Timestamp.day());

    await service.add(memberId, amount, expirationAt);

    const balance = await service.get(memberId);
    expect(balance).toBe(amount);
  });

  it('포인트 사용', async function() {
    const memberId = 1234n;
    const initialAmount = 200;
    const useAmount = 50;
    const expirationAt = new Date(Date.now() + Timestamp.day());

    await service.add(memberId, initialAmount, expirationAt);
    await service.use(memberId, useAmount, 1n);

    const balance = await service.get(memberId);
    expect(balance).toBe(150);
  });

  it('포인트 환불', async function() {
    const memberId = 12345n;
    const initialAmount = 300;
    const useAmount = 100;
    const refundAmount = 50;
    const expirationAt = new Date(Date.now() + Timestamp.day());

    await service.add(memberId, initialAmount, expirationAt);
    await service.use(memberId, useAmount, 2n);
    await service.refund(memberId, refundAmount, 2n);

    const balance = await service.get(memberId);
    expect(balance).toBe(250);
  });
});
