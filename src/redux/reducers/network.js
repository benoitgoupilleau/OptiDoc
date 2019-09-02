import {
  UPDATE_NET_STATUS,
} from '../actions/types';

const defaultState = {
  isConnected: true,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_NET_STATUS: {
      return {
        ...state,
        isConnected: action.isConnected,
      }
    }
    default:
      return state;
  }
};