import MSSQL from '../../services/mssql';
import Tables from '../../constants/Tables';

import {
  SET_DOCS,
  SET_DOE,
  SET_DOE_CHAP,
  SET_DOE_DOC,
  SET_MODELES,
  SET_PROTO_DMOS,
  SET_QMOS,
  SET_QUALIF,
  SET_SOUD
} from './types';


export const getDocs = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_docs}`)
  .then((res) => dispatch(setDocs(res)))
  .catch(e => console.log({ getDocs: e }))

const setDocs = (docs) => ({
  type: SET_DOCS,
  docs
})

export const getDoe = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_doe}`)
  .then((res) => dispatch(setDoe(res)))
  .catch(e => console.log({ getDoe: e }))

const setDoe = (doe) => ({
  type: SET_DOE,
  doe
})

export const getDoeChapt = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_doe_chapter}`)
  .then((res) => dispatch(setDoeChapt(res)))
  .catch(e => console.log({ getDoeChapt: e }))

const setDoeChapt = (doeChapter) => ({
  type: SET_DOE_CHAP,
  doeChapter
})

export const getDoeDoc = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_doe_doc}`)
  .then((res) => dispatch(setDoeDoc(res)))
  .catch(e => console.log({ getDoeDoc: e }))

const setDoeDoc = (doeDoc) => ({
  type: SET_DOE_DOC,
  doeDoc
})

export const getModeles = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_modeles}`)
  .then((res) => dispatch(setModeles(res)))
  .catch(e => console.log({ getModeles: e }))

const setModeles = (modeles) => ({
  type: SET_MODELES,
  modeles
})

export const getProtoDMOS = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_protoDMOS}`)
  .then((res) => dispatch(setProtoDMOS(res)))
  .catch(e => console.log({ getProtoDMOS: e }))

const setProtoDMOS = (protoDMOS) => ({
  type: SET_PROTO_DMOS,
  protoDMOS
})

export const getQMOS = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_qmos}`)
  .then((res) => dispatch(setQMOS(res)))
  .catch(e => console.log({ getQMOS: e }))

const setQMOS = (qmos) => ({
  type: SET_QMOS,
  qmos
})

export const getQualif = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_qualif}`)
  .then((res) => dispatch(setQualif(res)))
  .catch(e => console.log({ getQualif: e }))

const setQualif = (qualif) => ({
  type: SET_QUALIF,
  qualif
})

export const getSoud = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_soud}`)
  .then((res) => dispatch(setSoud(res)))
  .catch(e => console.log({ getSoud: e }))

const setSoud = (soud) => ({
  type: SET_SOUD,
  soud
})