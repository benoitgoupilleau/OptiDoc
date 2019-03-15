import { REHYDRATE } from 'redux-persist';
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED,
  UPD_CONNECTED_HOME,
  CONNECTING,
} from '../actions/types';

const defaultState = {
  isConnected: true,
  connecting: true,
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
    case CONNECTING: {
      return {
        ...state,
        connecting: true
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
        connecting: false,
      }
    case MSSQL_FAILED:
      return {
        ...state,
        mssqlConnected: false,
        mssqlConnectionFailed: true,
        connecting: false,
      }
    default:
      return state;
  }
};