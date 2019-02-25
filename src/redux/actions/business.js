import MSSQL from '../../services/mssql';
import Tables from '../../constants/Tables';

import {
  SET_DOCS,
  SET_MODELES,
  UPDATE_PREPARE,
  SET_BUSINESS,
  ADD_NEW_DOC,
  REMOVED_NEW_DOC,
  ADD_DOC,
  SET_AFFAIRES,
  SET_ARBO,
} from './types';


export const getDocs = (editedDocs) => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_docs}`)
  .then((res) => dispatch(setDocs(editedDocs, res)))
  .catch(e => console.log({ getDocs: e }))

const setDocs = (editedDocs, docs) => ({
  type: SET_DOCS,
  docs,
  editedDocs
})

export const addDoc = (doc) => ({
  type: ADD_DOC,
  doc
})

export const getModeles = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_modeles}`)
  .then((res) => dispatch(setModeles(res)))
  .catch(e => console.log({ getModeles: e }))

const setModeles = (modeles) => ({
  type: SET_MODELES,
  modeles
})

export const updatePrepared = (fileId, Prepared, PreparedOn) => ({
  type: UPDATE_PREPARE,
  fileId,
  Prepared,
  PreparedOn
})

export const getBusiness = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_business}`)
  .then((res) => dispatch(setBusiness(res)))
  .catch(e => console.log({ getBusiness: e }))

const setBusiness = (business) => ({
  type: SET_BUSINESS,
  business
})

export const addNewDoc = (doc) => ({
  type: ADD_NEW_DOC,
  doc
})

export const removeNewDoc = id => ({
  type: REMOVED_NEW_DOC,
  id
})

export const getAffaires = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_affaires}`)
  .then((res) => dispatch(setAffaires(res)))
  .catch(e => console.log({ getAffaires: e }))

const setAffaires = (affaires) => ({
  type: SET_AFFAIRES,
  affaires
})

export const getArbo = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_arbo}`)
  .then((res) => dispatch(setArbo(res)))
  .catch(e => console.log({ getArbo: e }))

const setArbo = (subFolder) => ({
  type: SET_ARBO,
  subFolder
})