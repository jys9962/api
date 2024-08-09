import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { MemberPointRepository } from '@/feature/point/domain/member-point.repository';
import { PointService } from '@/feature/point/service/point.service';
import { MemberPointRepositoryImpl } from '@/feature/point/repository/member-point.repository.impl';
import { Timestamp } from '@/common/type/timestamp';
import { DynamoDb } from '@/global/dynamodb/table/create-table.command';

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
            useClass: MemberPointRepositoryImpl,
          },
          {
            provide: DynamoDBDocumentClient,
            useFactory: () => DynamoDBDocumentClient.from(
              new DynamoDBClient({
                endpoint: 'http://localhost:8000',
                region: Date.now().toString(),
                credentials: {
                  accessKeyId: 'd1ncg',
                  secretAccessKey: 'wfr6bm',
                },
              }),
            ),
          },
        ],
      })
      .compile();

    service = module.get<PointService>(PointService);
    dynamoClient = module.get<DynamoDBDocumentClient>(DynamoDBDocumentClient);

    await createTable(dynamoClient);
  });

  it('should add and get points for a member', async () => {
    const memberId = 123n;
    const amount = 1000;
    const expirationAt = new Date(Date.now() + Timestamp.day());

    await service.add(memberId, amount, expirationAt);

    const balance = await service.get(memberId);
    expect(balance).toBe(amount);
  });

  it('should use points for a member', async () => {
    const memberId = 1234n;
    const initialAmount = 200;
    const useAmount = 50;
    const expirationAt = new Date(Date.now() + Timestamp.day());

    await service.add(memberId, initialAmount, expirationAt);
    await service.use(memberId, useAmount, 1n);

    const balance = await service.get(memberId);
    expect(balance).toBe(150);
  });

  it('should refund points for a member', async () => {
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

async function createTable(client: DynamoDBDocumentClient) {
  return client.send(
    DynamoDb.getCreateCommand(),
  );
}
