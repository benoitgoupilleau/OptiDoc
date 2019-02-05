import {
  SET_TEAM,
  SET_TEAM_RIGHTS,
  SET_USER
} from '../actions/types';

const defaultState = {
  teams: [],
  users: [],
  teamRights: [],
  teamLoaded: false,
  teamRightsLoaded: false,
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
    default:
      return state;
  }
};