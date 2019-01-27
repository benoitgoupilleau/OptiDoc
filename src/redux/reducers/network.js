import { REHYDRATE } from 'redux-persist';
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED
} from '../actions/types';

const defaultState = {
  isConnected: true,
  mssqlConnected: false,
  mssqlConnectionFailed: false
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
    default:
      return state;
  }
};