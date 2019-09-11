import { UPDATE_NET_STATUS, SET_INTERVAL, LOGOUT } from '../actions/types';
import { REHYDRATE } from 'redux-persist';

const defaultState = {
  isConnected: true,
  intervalNb: undefined
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...defaultState
      };
    }
    case UPDATE_NET_STATUS: {
      return {
        ...state,
        isConnected: action.isConnected
      };
    }
    case SET_INTERVAL: {
      return {
        ...state,
        intervalNb: action.intervalNb
      };
    }
    case LOGOUT: {
      return {
        ...state,
        intervalNb: undefined
      };
    }
    default:
      return state;
  }
};
