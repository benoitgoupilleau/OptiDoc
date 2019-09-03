import Sentry from '../../services/sentry';
import api from '../../services/api';

import { store } from '../store/store'

import {
  SET_DOCS,
  SET_MODELES,
  UPDATE_PREPARE,
  SET_BUSINESS,
  ADD_NEW_DOC,
  REMOVED_NEW_DOC,
  ADD_DOC,
  SET_ARBO,
  SET_DOCS_TO_DOWNLOAD,
  UPDATE_DOC
} from './types';

import FilesToExclude from '../../constants/FilesToExclude';

const identifyNewFiles = (downloadedAffaire, currentDocs, files) => {
  const fileToDownload = [];
  for (let i = 0; i < downloadedAffaire.length; i++) {
    const currentBusinessFile = currentDocs.filter(c => c.dossier1 === downloadedAffaire[i]);
    const newBusinessFile = files.filter(c => c.dossier1 === downloadedAffaire[i]);
    for (let j = 0; j < newBusinessFile.length; j++) {
      if (currentBusinessFile.length > 0) {
        const indexDoc = currentBusinessFile.findIndex(d => d.id === newBusinessFile[j].id)
        if (indexDoc > -1) {
          if (currentBusinessFile[indexDoc].upLoadedOn < newBusinessFile[j].upLoadedOn) {
            fileToDownload.push(newBusinessFile[j].id)
          }
        }
      } else {
        fileToDownload.push(newBusinessFile[j].id)
      }
    }
  }
  return fileToDownload;
}

export const getDocs = (currentDocs = [], downloadedAffaire = [], editedDocs = []) => dispatch => {
  const { user } = store.getState();
  return api.get(`/api/documents/fromuser/${user.id}`, { headers: { Authorization: `Bearer ${user.bearerToken}` } })
    .then((res) => {
      const files = res.data.filter(d => !FilesToExclude.includes(d.dossier3))
      const fileToDownload = identifyNewFiles(downloadedAffaire, currentDocs, files);
      if (fileToDownload.length > 0) {
        dispatch(setDocsToDownload(fileToDownload))
      }
      return dispatch(setDocs(editedDocs, files))
    })
    .catch(e => {
      Sentry.captureException(e, { func: 'getDocs', doc: 'businessActions' })
      return;
    })
}

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

export const updateDocName = (fileName, id) => ({
  type: UPDATE_DOC,
  fileName,
  id
})

export const getModeles = () => dispatch => {
  const { user } = store.getState();
  return api.get('/api/modeles', { headers: { Authorization: `Bearer ${user.bearerToken}` } })
    .then((res) => dispatch(setModeles(res.data)))
    .catch(e => {
      Sentry.captureException(e, { func: 'getModeles', doc: 'businessActions' })
      return;
    })
}

const setModeles = (modeles) => ({
  type: SET_MODELES,
  modeles
})

export const updatePrepared = (fileId, prepared, preparedOn, preparedBy, revisable) => ({
  type: UPDATE_PREPARE,
  fileId,
  prepared,
  preparedOn,
  preparedBy,
  revisable
})

export const getBusiness = () => dispatch => {
  const { user } = store.getState();
  return api.get(`/api/affaires/fromuser/${user.id}`, { headers: { Authorization: `Bearer ${user.bearerToken}` } })
    .then((res) => {
      return dispatch(setBusiness(res.data))
    })
    .catch(e => {
      Sentry.captureException(e, { func: 'getBusiness', doc: 'businessActions' })
      return;
    })
}

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

export const getArbo = () => dispatch => {
  const { user } = store.getState();
  return api.get('/api/arbo', { headers: { Authorization: `Bearer ${user.bearerToken}` } })
    .then((res) => dispatch(setArbo(res.data)))
    .catch(e => {
      Sentry.captureException(e, { func: 'getArbo', doc: 'businessActions' })
      return;
    })
}

const setArbo = (subFolder) => ({
  type: SET_ARBO,
  subFolder
})