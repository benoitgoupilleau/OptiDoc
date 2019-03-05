import MSSQL from '../../services/mssql';
import Tables from '../../constants/Tables';
import Sentry from '../../services/sentry'

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
  SET_DOCS_TO_DOWNLOAD
} from './types';


export const getDocs = (currentDocs, downloadedAffaire, editedDocs) => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_docs}`)
  .then((res) => {
    const fileToDownload = [];
    for (let i = 0; i < downloadedAffaire.length; i++) {
      const currentBusinessFile = currentDocs.filter(c => c.Dossier1 === downloadedAffaire[i]);
      const newBusinessFile = res.filter(c => c.Dossier1 === downloadedAffaire[i]);
      for (let j = 0; j < newBusinessFile.length; j++) {
        const indexDoc = currentBusinessFile.findIndex(d => d.ID === newBusinessFile[i].ID)
        if (indexDoc > -1) {
          if (currentBusinessFile[indexDoc].UpLoadedOn < newBusinessFile[i].UpLoadedOn) {
            fileToDownload.push(newBusinessFile[i].ID)
          }
        }
      }
    }
    if (fileToDownload.length > 0) {
      dispatch(setDocsToDownload(fileToDownload))
    }
    return dispatch(setDocs(editedDocs, res))
  })
  .catch(e => Sentry.captureException(e, { func: 'getDocs', doc: 'businessActions' }))

const setDocs = (editedDocs, docs) => ({
  type: SET_DOCS,
  docs,
  editedDocs
})

const setDocsToDownload = (fileToDownload) => ({
  type: SET_DOCS_TO_DOWNLOAD,
  fileToDownload
})

export const addDoc = (doc) => ({
  type: ADD_DOC,
  doc
})

export const getModeles = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_modeles}`)
  .then((res) => dispatch(setModeles(res)))
  .catch(e => Sentry.captureException(e, { func: 'getModeles', doc: 'businessActions' }))

const setModeles = (modeles) => ({
  type: SET_MODELES,
  modeles
})

export const updatePrepared = (fileId, Prepared, PreparedOn, PreparedBy) => ({
  type: UPDATE_PREPARE,
  fileId,
  Prepared,
  PreparedOn,
  PreparedBy
})

export const getBusiness = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_business}`)
  .then((res) => dispatch(setBusiness(res)))
  .catch(e => Sentry.captureException(e, { func: 'getBusiness', doc: 'businessActions' }))

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
  .catch(e => Sentry.captureException(e, { func: 'getAffaires', doc: 'businessActions' }))

const setAffaires = (affaires) => ({
  type: SET_AFFAIRES,
  affaires
})

export const getArbo = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_arbo}`)
  .then((res) => dispatch(setArbo(res)))
  .catch(e => Sentry.captureException(e, { func: 'getArbo', doc: 'businessActions' }))

const setArbo = (subFolder) => ({
  type: SET_ARBO,
  subFolder
})