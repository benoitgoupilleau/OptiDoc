import MSSQL from 'react-native-mssql';

import { SQL_SERVER_URL_OUT, SQL_SERVER_USER, SQL_SERVER_PASSWORD, SQL_SERVER_DBNAME } from 'react-native-dotenv';

export const configOut = {
  server: SQL_SERVER_URL_OUT,
  username: SQL_SERVER_USER,
  password: SQL_SERVER_PASSWORD,
  database: SQL_SERVER_DBNAME,
  port: 1433,
  timeout: 30
}

export default MSSQL;
