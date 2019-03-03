import MSSQL from '../../services/mssql';
import Tables from '../../constants/Tables';
import Sentry from '../../services/sentry'

import {
  SET_USER
} from './types';


export const getUser = () => dispatch =>  MSSQL.executeQuery(`SELECT * FROM ${Tables.t_users}`)
  .then((res) => dispatch(setUser(res)))
  .catch(e => Sentry.captureException(e, { func: 'getUser', doc: 'teamActions' }))

const setUser = (users) => ({
  type: SET_USER,
  users
})