import MSSQL from '../../services/mssql';
import Tables from '../../constants/Tables';

import {
  SET_DOCS
} from './types';


export const getDocs = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_docs}`)
  .then((res) => dispatch(setDocs(res)))
  .catch(e => console.log({ getDocs: e }))

const setDocs = (docs) => ({
  type: SET_DOCS,
  docs
})