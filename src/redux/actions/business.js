import MSSQL from '../../services/mssql';
import Tables from '../../constants/Tables';

import {
  SET_DOCS,
  SET_MODELES,
} from './types';


export const getDocs = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_docs}`)
  .then((res) => dispatch(setDocs(res)))
  .catch(e => console.log({ getDocs: e }))

const setDocs = (docs) => ({
  type: SET_DOCS,
  docs
})

export const getModeles = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_modeles}`)
  .then((res) => dispatch(setModeles(res)))
  .catch(e => console.log({ getModeles: e }))

const setModeles = (modeles) => ({
  type: SET_MODELES,
  modeles
})
