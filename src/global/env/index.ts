import * as dotenv from 'dotenv';

dotenv.config();

const processEnv: Record<string, string | undefined> = process.env;

export const env = {
  mysql: {
    host: processEnv.MYSQL_HOST!,
    username: processEnv.MYSQL_USER!,
    password: processEnv.MYSQL_PASSWORD!,
    database: processEnv.MYSQL_DATABASE!,
  },
  isTest: processEnv.NODE_ENV === 'test',
  mode: processEnv.NODE_ENV,

};
