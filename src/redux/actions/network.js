import MSSQL, { config } from '../../services/mssql';
import {
  UPDATE_NET_STATUS,
  MSSQL_CONNECTED,
  MSSQL_FAILED,
} from './types';

export const connectDb = () => dispatch => MSSQL.connect(config)
  .then(() => {
    dispatch(dbSuccess())
  })
  .catch(e => {
    console.log({ connectDb: e })
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
