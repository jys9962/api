import { Module, OnModuleInit } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDb } from '@/global/dynamodb/table/create-table.command';

@Module({
  providers: [
    {
      provide: DynamoDBDocumentClient,
      useFactory: () =>
        DynamoDBDocumentClient.from(
          new DynamoDBClient({
            endpoint: 'http://localhost:8000',
            credentials: {
              accessKeyId: 'd1ncg',
              secretAccessKey: 'wfr6bm',
            },
            region: 'localhost',
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
      DynamoDb.getCreateCommand(),
    );
  }

}
