import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  mysql: {
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
};
