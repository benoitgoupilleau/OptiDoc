import MSSQL from '../../services/mssql';
import Tables from '../../constants/Tables';

import {
  SET_TEAM,
  REFRESH_TEAM
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