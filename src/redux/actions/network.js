import MSSQL, { configOut, configHome } from '../../services/mssql';
import { setUpFTPHome, setUpFTPOut } from '../../services/ftp'
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED,
} from './types';

export const connectDbOut = () => dispatch => MSSQL.connect(configOut)
  .then(() => {
    setUpFTPOut();
    return dispatch(dbSuccess(false))
  })
  .catch(e => {
    console.log({ connectDbOut: e })
    return dispatch(dbFailed())
  })

export const connectDbHome = () => dispatch => MSSQL.connect(configHome)
  .then(() => {
    setUpFTPHome();
    return dispatch(dbSuccess(true))
  })
  .catch(e => {
    console.log({ connectDbHome: e })
    return dispatch(dbFailed())
  })

export const switchDb = (connectHome = false) => dispatch => MSSQL.close()
  .then(() => {
    if (connectHome) {
      return MSSQL.connect(configHome)
        .then(() => {
          setUpFTPHome();
          return dispatch(dbSuccess(true))
        })
    }
    return MSSQL.connect(configOut)
      .then(() => {
        setUpFTPOut();
        return dispatch(dbSuccess(false))
      })
  })
  .catch(e => {
    console.log({ switchDb: e })
    return dispatch(dbFailed())
  })

const dbSuccess = (connectedHome = false) => ({
  type: MSSQL_CONNECTED,
  connectedHome
})

const dbFailed = () => ({
  type: MSSQL_FAILED
})


export const connectivityChange = (isConnected) => ({
  type: UPDATE_NET_STATUS,
  isConnected
})
