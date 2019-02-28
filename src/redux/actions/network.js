import MSSQL, { configOut, configHome } from '../../services/mssql';
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED,
} from './types';

export const connectDbOut = () => dispatch => MSSQL.connect(configOut)
  .then(() => dispatch(dbSuccess()))
  .catch(e => {
    console.log({ connectDbOut: e })
    return dispatch(dbFailed())
  })

export const connectDbHome = () => dispatch => MSSQL.connect(configHome)
  .then(() => dispatch(dbSuccess()))
  .catch(e => {
    console.log({ connectDbHome: e })
    return dispatch(dbFailed())
  })


const dbSuccess = () => ({
  type: MSSQL_CONNECTED
})

const dbFailed = () => ({
  type: MSSQL_FAILED
})


export const connectivityChange = (isConnected) => ({
  type: UPDATE_NET_STATUS,
  isConnected
})
