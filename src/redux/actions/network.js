import { FTP_URL_HOME, FTP_URL_OUT, FTP_PORT_HOME, FTP_PORT_OUT } from 'react-native-dotenv';
import MSSQL, { configOut, configHome } from '../../services/mssql';
import FTP from '../../services/ftp';
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED,
} from './types';

export const connectDbOut = () => dispatch => MSSQL.connect(configOut)
  .then(() => {
    FTP.setup(FTP_URL_OUT, parseInt(FTP_PORT_OUT, 10));
    dispatch(dbSuccess())
  })
  .catch(e => {
    console.log({ connectDbOut: e })
    return dispatch(dbFailed())
  })

export const connectDbHome = () => dispatch => MSSQL.connect(configHome)
  .then(() => {
    FTP.setup(FTP_URL_HOME, parseInt(FTP_PORT_HOME, 10));
    dispatch(dbSuccess())
  })
  .catch(e => {
    console.log({ connectDbHome: e })
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
