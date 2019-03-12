import { REHYDRATE } from 'redux-persist';
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED,
  UPD_CONNECTED_HOME,
} from '../actions/types';

const defaultState = {
  isConnected: true,
  mssqlConnected: false,
  mssqlConnectionFailed: false,
  connectedHome: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      const connectedHome = action.payload && action.payload.network && !!action.payload.network.connectedHome ? action.payload.network.connectedHome : defaultState.connectedHome; 
      return {
        ...defaultState,
        connectedHome
      }
    }
    case UPDATE_NET_STATUS: {
      const mssqlConnected = action.isConnected ? state.mssqlConnected : false;
      return {
        ...state,
        isConnected: action.isConnected,
        mssqlConnected
      }
    }
    case UPD_CONNECTED_HOME: {
      return {
        ...state,
        connectedHome: action.connectedHome
      }
    }
    case MSSQL_CONNECTED:
      return {
        ...state,
        mssqlConnected: true,
        mssqlConnectionFailed: false,
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