import { REHYDRATE } from 'redux-persist';
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED,
  FTP_CONNECTED,
  FTP_FAILED
} from '../actions/types';

const defaultState = {
  isConnected: true,
  mssqlConnected: false,
  mssqlConnectionFailed: false,
  ftpConnected: false,
  ftpConnectionFailed: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case REHYDRATE: 
      return {
        ...defaultState
      }
    case UPDATE_NET_STATUS:
      return {
        ...state,
        isConnected: action.isConnected
      }
    case MSSQL_CONNECTED:
      return {
        ...state,
        mssqlConnected: true,
        mssqlConnectionFailed: false
      }
    case MSSQL_FAILED:
      return {
        ...state,
        mssqlConnected: false,
        mssqlConnectionFailed: true
      }
    case FTP_CONNECTED:
      return {
        ...state,
        ftpConnected: true,
        ftpConnectionFailed: false
      }
    case FTP_FAILED:
      return {
        ...state,
        ftpConnected: false,
        ftpConnectionFailed: true
      }
    default:
      return state;
  }
};