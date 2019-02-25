import MSSQL from 'react-native-mssql';

import { SQL_SERVER_URL_OUT, SQL_SERVER_URL_HOME, SQL_SERVER_USER, SQL_SERVER_PASSWORD, SQL_SERVER_DBNAME } from 'react-native-dotenv';

export const configOut = {
  server: SQL_SERVER_URL_OUT,
  username: SQL_SERVER_USER,
  password: SQL_SERVER_PASSWORD,
  database: SQL_SERVER_DBNAME
}

export const configHome = {
  server: SQL_SERVER_URL_HOME,
  username: SQL_SERVER_USER,
  password: SQL_SERVER_PASSWORD,
  database: SQL_SERVER_DBNAME
}

export default MSSQL;
