import SQLite from 'react-native-sqlite-storage';

const errorCB = (err) => {
  console.log("SQL Error: " + err);
}

const successCB = () => {
  console.log("SQL executed fine");
}

const openCB = () => {
  console.log("Database OPENED");
}

const db = SQLite.openDatabase("test.db", "1.0", "Test Database", 200000, openCB, errorCB);


export default db;