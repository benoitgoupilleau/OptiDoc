import {
  SET_USER
} from '../actions/types';

const defaultState = {
  users: [],
  usersLoaded: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        users: action.users,
        usersLoaded: true
      }
    default:
      return state;
  }
};