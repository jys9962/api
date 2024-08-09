import { CreateTableCommand } from '@aws-sdk/client-dynamodb';

export type TableSchema = ConstructorParameters<typeof CreateTableCommand>[0];
