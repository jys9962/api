import { Module, OnModuleInit } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CreateTableCommand, DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';

@Module({
  providers: [
    {
      provide: DynamoDBDocumentClient,
      useFactory: () =>
        DynamoDBDocumentClient.from(
          new DynamoDBClient({
            region: 'local',
            endpoint: 'http://localhost:8000',
          }),
          {
            marshallOptions: {
              convertEmptyValues: false, // false, by default.
              removeUndefinedValues: true, // false, by default.
              convertClassInstanceToMap: false, // false, by default.
            },
            unmarshallOptions: {
              wrapNumbers: false,
            },
          },
        ),
    },
  ],
  exports: [
    DynamoDBDocumentClient,
  ],
})
export class DynamodbModule implements OnModuleInit {

  constructor(
    private readonly client: DynamoDBDocumentClient,
  ) {}

  async onModuleInit() {
    const { TableNames } = await this.client.send(
      new ListTablesCommand({}),
    );

    const existApiTable = TableNames?.some(t => t === 'api');
    if (existApiTable) {
      return;
    }

    await this.client.send(
      new CreateTableCommand({
        TableName: 'api',
        KeySchema: [
          { AttributeName: 'pk', KeyType: 'HASH' },  // 파티션 키
          { AttributeName: 'sk', KeyType: 'RANGE' },  // 정렬 키
        ],
        AttributeDefinitions: [
          { AttributeName: 'pk', AttributeType: 'S' },
          { AttributeName: 'sk', AttributeType: 'S' },
          { AttributeName: 'gsi1sk', AttributeType: 'S' },
          { AttributeName: 'gsi2sk', AttributeType: 'S' },
          { AttributeName: 'gsi3pk', AttributeType: 'S' },
          { AttributeName: 'gsi3sk', AttributeType: 'S' },
          { AttributeName: 'gsi4pk', AttributeType: 'S' },
          { AttributeName: 'gsi4sk', AttributeType: 'S' },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'gsi1',
            KeySchema: [
              { AttributeName: 'sk', KeyType: 'HASH' },
              { AttributeName: 'gsi1sk', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
          },
          {
            IndexName: 'gsi2',
            KeySchema: [
              { AttributeName: 'sk', KeyType: 'HASH' },
              { AttributeName: 'gsi2sk', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'KEYS_ONLY' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
          },
          {
            IndexName: 'gsi3',
            KeySchema: [
              { AttributeName: 'gsi3pk', KeyType: 'HASH' },
              { AttributeName: 'gsi3sk', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'ALL' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
          },
          {
            IndexName: 'gsi4',
            KeySchema: [
              { AttributeName: 'gsi4pk', KeyType: 'HASH' },
              { AttributeName: 'gsi4sk', KeyType: 'RANGE' },
            ],
            Projection: { ProjectionType: 'KEYS_ONLY' },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
          },
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      }),
    );
  }

}
