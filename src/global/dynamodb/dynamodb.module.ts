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
            credentials: {
              accessKeyId: 'adsf',
              secretAccessKey: 'secret',
            },
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
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      }),
    );
  }

}
