import MSSQL from 'react-native-mssql';

import { SQL_SERVER_URL, SQL_SERVER_USER, SQL_SERVER_PASSWORD, SQL_SERVER_DBNAME } from 'react-native-dotenv';

export const config = {
  server: SQL_SERVER_URL,
  username: SQL_SERVER_USER,
  password: SQL_SERVER_PASSWORD,
  database: SQL_SERVER_DBNAME
}

export const connectDb = async () => {
  return await MSSQL.connect(config)
}

export default MSSQL;
