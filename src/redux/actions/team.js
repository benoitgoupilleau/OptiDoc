import MSSQL_Out from '../../services/mssqlOut';
import MSSQL_Home from '../../services/mssqlHome';
import Tables from '../../constants/Tables';
import Sentry from '../../services/sentry'

import {
  SET_USER
} from './types';


export const getUser = (connectHome = false) => dispatch =>  {
  if (connectHome) {
    return MSSQL_Home.executeQuery(`SELECT * FROM ${Tables.t_users}`)
      .then((res) => dispatch(setUser(res)))
      .catch(e => {
        Sentry.captureException(e, { func: 'getUser', doc: 'teamActions' })
        console.error({ e, func: 'getUser', doc: 'teamActions' })
        return;
      })
  }
  return MSSQL_Out.executeQuery(`SELECT * FROM ${Tables.t_users}`)
    .then((res) => dispatch(setUser(res)))
    .catch(e => {
      Sentry.captureException(e, { func: 'getUser', doc: 'teamActions' })
      console.error({ e, func: 'getUser', doc: 'teamActions' })
      return;
    })
}

const setUser = (users) => ({
  type: SET_USER,
  users
})