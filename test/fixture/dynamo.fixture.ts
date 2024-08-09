import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { MyDynamo } from '@/global/dynamodb/table/create-table.command';
import { CreateTableCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb';


export namespace DynamoTest {

  export const createTable = (client: DynamoDBDocumentClient) => {
    return client.send(
      new CreateTableCommand(MyDynamo.tableSchema)
    );
  };

  export const deleteTable = (client: DynamoDBDocumentClient) => {
    return client.send(
      new DeleteTableCommand({
        TableName: 'api'
      })
    );
  };


}


