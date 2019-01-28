import MSSQL, { config } from '../../services/mssql';
import FTP from '../../services/ftp';
import { FTP_USERNAME, FTP_PASSWORD } from 'react-native-dotenv';
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED,
  FTP_CONNECTED,
  FTP_FAILED
} from './types';

export const connectDb = () => dispatch => MSSQL.connect(config)
  .then(() => {
    dispatch(dbSuccess())
  })
  .catch(e => {
    console.log({ connectDb: e })
    return dispatch(dbFailed())
  })


const dbSuccess = () => ({
  type: MSSQL_CONNECTED
})

const dbFailed = () => ({
  type: MSSQL_FAILED
})


export const connectivityChange = (isConnected) => ({
  type: UPDATE_NET_STATUS,
  isConnected
})


export const connectFtp = () => dispatch => dispatch(ftpSuccess())

const ftpSuccess = () => ({
  type: FTP_CONNECTED
})

const ftpFailed = () => ({
  type: FTP_FAILED
})