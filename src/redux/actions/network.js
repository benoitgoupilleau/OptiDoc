import MSSQL_Out, { configOut } from '../../services/mssqlOut';
import MSSQL_Home, { configHome } from '../../services/mssqlHome';
import { setUpFTPHome, setUpFTPOut } from '../../services/ftp'
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED,
  UPD_CONNECTED_HOME,
  CONNECTING,
} from './types';
import Sentry from '../../services/sentry'

const connecting = () => ({
  type: CONNECTING
})

export const connectDbOut = () => dispatch => {
  dispatch(updateConnectedHome(false))
  dispatch(connecting())
  setUpFTPOut();
  return MSSQL_Out.connect(configOut)
    .then(() => {
      return dispatch(dbSuccess())
    })
    .catch(e => {
      Sentry.captureException(e, { func: 'connectDbOut', doc: 'networkActions' })
      return dispatch(dbFailed())
    })
}

export const connectDbHome = () => dispatch => {
  dispatch(updateConnectedHome(true))
  dispatch(connecting())
  setUpFTPHome();
  return MSSQL_Home.connect(configHome)
    .then(() => {
      return dispatch(dbSuccess())
    })
    .catch(e => {
      Sentry.captureException(e, { func: 'connectDbHome', doc: 'networkActions' })
      return dispatch(dbFailed())
    })
}

export const switchDb = (connectHome = false, mssqlConnected = false) => dispatch => {
  dispatch(dbFailed())
  dispatch(connecting())
  if (connectHome) {
    dispatch(updateConnectedHome(true))
    setUpFTPHome();
    if (mssqlConnected) {
      return MSSQL_Out.close().then(() => MSSQL_Home.connect(configHome)
        .then(() => {
          return dispatch(dbSuccess())
        })
        .catch(e => {
          Sentry.captureException(e, { func: 'switchDb', doc: 'networkActions' })
          return dispatch(dbFailed())
        })
      )
    }
    return MSSQL_Home.connect(configHome)
      .then(() => {
        return dispatch(dbSuccess())
      })
      .catch(e => {
        Sentry.captureException(e, { func: 'switchDb', doc: 'networkActions' })
        return dispatch(dbFailed())
      })
  }
  dispatch(updateConnectedHome(false))
  setUpFTPOut();
  if (mssqlConnected) {
    return MSSQL_Home.close().then(() => MSSQL_Out.connect(configOut)
      .then(() => {
        return dispatch(dbSuccess())
      })
      .catch(e => {
        Sentry.captureException(e, { func: 'switchDb', doc: 'networkActions' })
        return dispatch(dbFailed())
      })
    )
  }
  return MSSQL_Out.connect(configOut)
    .then(() => {
      return dispatch(dbSuccess())
    })
    .catch(e => {
      Sentry.captureException(e, { func: 'switchDb', doc: 'networkActions' })
      return dispatch(dbFailed())
    })
}

const dbSuccess = () => ({
  type: MSSQL_CONNECTED,
})

const updateConnectedHome = (connectedHome = false) => ({
  type: UPD_CONNECTED_HOME,
  connectedHome
})

const dbFailed = () => ({
  type: MSSQL_FAILED
})


export const connectivityChange = (isConnected) => ({
  type: UPDATE_NET_STATUS,
  isConnected
})
