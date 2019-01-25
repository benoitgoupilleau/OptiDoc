import {
  LOGOUT,
  UPDATE_NET_STATUS
} from '../actions/types';

const defaultState = {
  isConnected: true
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_NET_STATUS:
      return {
        ...state,
        isConnected: action.isConnected
      }
    case LOGOUT:
      return { ...defaultState };
    default:
      return state;
  }
};