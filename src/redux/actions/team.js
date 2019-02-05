import MSSQL from '../../services/mssql';
import Tables from '../../constants/Tables';

import {
  SET_TEAM,
  REFRESH_TEAM,
  SET_TEAM_RIGHTS,
  SET_USER
} from './types';


export const getTeam = () => dispatch =>  MSSQL.executeQuery(`SELECT * FROM ${Tables.t_team}`)
  .then((res) => dispatch(setTeam(res)))
  .catch(e => console.log({ getTeam: e }))

const setTeam = (teams) => ({
  type: SET_TEAM,
  teams
})

export const refreshTeam = () => ({
  type: REFRESH_TEAM
})


export const getTeamRight = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_teamRights}`)
  .then((res) => dispatch(setTeamRight(res)))
  .catch(e => console.log({ getTeamRight: e }))

const setTeamRight = (teamRights) => ({
  type: SET_TEAM_RIGHTS,
  teamRights
})

export const getUser = () => dispatch =>  MSSQL.executeQuery(`SELECT * FROM ${Tables.t_users}`)
  .then((res) => dispatch(setUser(res)))
  .catch(e => console.log({ getUser: e }))

const setUser = (users) => ({
  type: SET_USER,
  users
})