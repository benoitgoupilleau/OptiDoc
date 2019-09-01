import { REHYDRATE } from 'redux-persist';
import {
  UPDATE_NET_STATUS,
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
    default:
      return state;
  }
};