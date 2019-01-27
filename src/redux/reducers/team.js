import {
  SET_TEAM,
  SET_TEAM_RIGHTS,
  LOGOUT
} from '../actions/types';

const defaultState = {
  teams: [],
  teamRights: [],
  teamLoaded: false,
  teamRightsLoaded: false,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_TEAM:
      return {
        ...state,
        teams: action.teams,
        teamLoaded: true
      }
    case SET_TEAM_RIGHTS:
      return {
        ...state,
        teamRights: action.teamRights,
        teamRightsLoaded: true
      }
    case LOGOUT:
      return {
        ...defaultState
      }
    default:
      return state;
  }
};