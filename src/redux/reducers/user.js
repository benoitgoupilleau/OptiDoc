import omit from 'lodash.omit';
import {
  LOGIN,
  LOGOUT
} from '../actions/types';

const defaultState = {
  id: undefined,
  bearerToken: '',
  email: ''
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        email: action.email,
        bearerToken: action.bearerToken,
        id: action.id
      }
    case LOGOUT:
      return {
        ...state,
        ...omit(defaultState, 'email')
      }
    default:
      return state;
  }
};