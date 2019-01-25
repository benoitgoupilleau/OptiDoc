import {
  SET_TEAM
} from '../actions/types';

const defaultState = {
  teams: [],
  loaded: false,
  refreshing: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_TEAM:
      return {
        ...state,
        teams: action.teams,
        loaded: true,
        refreshing: false
      }
    default:
      return state;
  }
};