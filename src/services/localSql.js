import SQLite from 'react-native-sqlite-storage';

import { LOCAL_SQL_DB } from 'react-native-dotenv';

export let localdbConnected = false

const errorCB = (err) => {
  console.log("SQL Error: " + err);
}

const successCB = () => {
  console.log("SQL executed fine");
}

const openCB = () => {
  localdbConnected = true
  console.log("Database OPENED");
}

const db = SQLite.openDatabase(LOCAL_SQL_DB, "1.0", "Local Optidoc Database", 200000, openCB, errorCB);


export default db;