import {
  SET_TEAM,
  SET_TEAM_RIGHTS
} from '../actions/types';

const defaultState = {
  teams: [],
  teamRights: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_TEAM:
      return {
        ...state,
        teams: action.teams,
      }
    case SET_TEAM_RIGHTS:
      return {
        ...state,
        teamRights: action.teamRights
      }
    default:
      return state;
  }
};