import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob'
import { API_URL } from 'react-native-dotenv';
import FileViewer from 'react-native-file-viewer';
import Sentry from '../../services/sentry'
import api from '../../services/api';

import { store } from '../store/store'

import {
  LOGIN,
  LOGOUT,
  SESSION_EXPIRED,
  BUSINESS_DOWNLOADED,
  DOWNLOADING_BUSINESS,
  CANCEL_DOWNLOAD,
  EDIT_FILE,
  DOWNLOADING_MODELE,
  CANCEL_DOWNLOAD_MODELE,
  MODELE_DOWNLOADED,
  REMOVE_EDIT_FILE,
  UPLOADING_FILE,
  CANCEL_UPLOAD,
  REMOVE_EDIT_PREPARE,
  CANCEL_DOWNLOAD_FILE,
  FILE_DOWNLOADED,
  DOWNLOADING_FILE,
  MULTI_UPLOAD
} from './types';

import { removeNewDoc, addDoc } from './business'

import Folder from '../../constants/Folder'

import rootDir from '../../services/rootDir';

export const loginApi = (userName, MdP, successCallback, errorCallback) => dispatch => api.post('/api/login', { login: userName, MdP })
  .then((res) => {
    const { username, id_user, token } = res.data;
    successCallback();
    return dispatch(setUser(userName, id_user, token, username));
  })
  .catch(() => {
    return errorCallback()
  })

const setUser = (userName, userId, bearerToken, name) => ({
  type: LOGIN,
  userName,
  bearerToken,
  id: userId,
  name
})

export const logout = () => ({
  type: LOGOUT
});

export const sessionExpired = () => ({
  type: SESSION_EXPIRED
});

export const downLoadOneFile = (id, extension, businessId) => async (dispatch) => {
  const { user } = store.getState();
  const destinationFolder = `${rootDir}/${user.id}/${businessId}`;
  dispatch(downloadingFile(id))
  return RNFetchBlob
    .config({
      timeout: 60000,
      path: `${destinationFolder}/${Folder.prep}/${id}.${extension}`
    })
    .fetch('GET', `${API_URL}/api/pdffile/download/${id}`, {
      Authorization: `Bearer ${user.bearerToken}`
    })
    .then(() => {
      dispatch(fileDownloaded(id));
    })
    .catch((e) => {
      Sentry.captureException(e, { func: 'downLoadOneFile', doc: 'userActions' })
      dispatch(cancelDownloadOneFile(id))
      return;
    })
}

const downloadingFile = (id) => ({
  type: DOWNLOADING_FILE,
  id
})

const cancelDownloadOneFile = (id) => ({
  type: CANCEL_DOWNLOAD_FILE,
  id
});

const fileDownloaded = (id) => ({
  type: FILE_DOWNLOADED,
  id
})

export const downloadBusiness = (userId, businessId, prep, rea) => dispatch => {
  dispatch(downloading(businessId, 0, 0));
  const { user } = store.getState();
  const total = prep.length + rea.length;
  const destinationFolder = `${rootDir}/${userId}/${businessId}`
  return RNFS.mkdir(destinationFolder)
    .then(async () => {
      let nbDownloading = 0
      if (prep.length > 0) {
        await RNFS.mkdir(`${destinationFolder}/${Folder.prep}`);
        for (let i = 0; i < prep.length; i += 1) {
          try {
            const fileExists = await RNFS.exists(`${destinationFolder}/${Folder.prep}/${prep[i].id}.${prep[i].extension}`)
            nbDownloading = nbDownloading + 1;
            dispatch(downloading(businessId, nbDownloading, total))
            if (!fileExists) {
              await RNFetchBlob
                .config({
                  timeout: 60000,
                  path: `${destinationFolder}/${Folder.prep}/${prep[i].id}.${prep[i].extension}`
                })
                .fetch('GET', `${API_URL}/api/pdffile/download/${prep[i].id}`, {
                  Authorization: `Bearer ${user.bearerToken}`
                })
            }
          } catch (error) {
            Sentry.captureException(error, { prepDoc: prep[i], func: "downloadFile", doc: 'userActions' })
            return dispatch(cancelDownload(businessId))
          }
        }
      }
      if (rea.length > 0) {
        await RNFS.mkdir(`${destinationFolder}/${Folder.rea}`);
        for (let i = 0; i < rea.length; i += 1) {
          try {
            const fileExists = await RNFS.exists(`${destinationFolder}/${Folder.rea}/${rea[i].id}.${rea[i].extension}`)
            nbDownloading = nbDownloading + 1;
            dispatch(downloading(businessId, nbDownloading, total))
            if (!fileExists) {
              await RNFetchBlob
                .config({
                  timeout: 60000,
                  path: `${destinationFolder}/${Folder.rea}/${rea[i].id}.${rea[i].extension}`
                })
                .fetch('GET', `${API_URL}/api/pdffile/download/${rea[i].id}`, {
                  Authorization: `Bearer ${user.bearerToken}`
                })
            }
          } catch (error) {
            Sentry.captureException(error, { reaDoc: rea[i], func: "downloadFile", doc: 'userActions' })
            return dispatch(cancelDownload(businessId))
          }
        }
      }
      return dispatch(businessDownloaded(businessId))
    })
    .catch(async (e) => {
      Sentry.captureException(e, { func: 'downloadBusiness', doc: 'userActions' })
      return dispatch(cancelDownload(businessId))
    })
}

const cancelDownload = (id) => ({
  type: CANCEL_DOWNLOAD,
  id
})

const downloading = (id, nb, total) => ({
  type: DOWNLOADING_BUSINESS,
  id,
  nb,
  total
})

const businessDownloaded = (id) => ({
  type: BUSINESS_DOWNLOADED,
  id
})

export const editPrepare = (file) => ({
  type: EDIT_FILE,
  file
})

export const removePrepare = (id) => ({
  type: REMOVE_EDIT_PREPARE,
  id
})

export const editFile = (file, filePath) => {
  FileViewer.open(filePath, { showOpenWithDialog: true });
  return ({
    type: EDIT_FILE,
    file
  })
}

export const forceDownloadModels = (modeleDocs) => dispatch => {
  const { user } = store.getState();
  const destinationFolder = `${rootDir}/${Folder.modeleDocs}`;
  const total = modeleDocs.length;
  return RNFS.mkdir(destinationFolder)
    .then(async () => {
      for (let i = 0; i < modeleDocs.length; i += 1) {
        dispatch(downloadModele(i + 1, total))
        await RNFetchBlob
          .config({
            timeout: 60000,
            path: `${destinationFolder}/${modeleDocs[i].iD_Document}.pdf`
          })
          .fetch('GET', `${API_URL}/api/pdffile/download/${modeleDocs[i].iD_Document}`, {
            Authorization: `Bearer ${user.bearerToken}`
          })
      }
      return dispatch(modeleDownloaded())
    })
    .catch((e) => {
      dispatch(cancelDownloadModel())
      Sentry.captureException(e, { func: 'forceDownloadModels', doc: 'userActions' })
      return
    })
}

export const downloadModels = (modeleDocs) => dispatch => {
  const { user } = store.getState();
  const total = modeleDocs.length;
  const destinationFolder = `${rootDir}/${Folder.modeleDocs}`;
  return RNFS.mkdir(destinationFolder)
    .then(async () => {
      for (let i = 0; i < modeleDocs.length; i += 1) {
        const fileExists = await RNFS.exists(`${destinationFolder}/${modeleDocs[i].iD_Document}.pdf`);
        if (!fileExists) {
          dispatch(downloadModele(i + 1, total))
          await RNFetchBlob
            .config({
              timeout: 60000,
              path: `${destinationFolder}/${modeleDocs[i].iD_Document}.pdf`
            })
            .fetch('GET', `${API_URL}/api/pdffile/download/${modeleDocs[i].iD_Document}`, {
              Authorization: `Bearer ${user.bearerToken}`
            })
        }
      }
      return dispatch(modeleDownloaded())
    })
      .catch((e) => {
        dispatch(cancelDownloadModel())
        Sentry.captureException(e, { func: 'downloadModels', doc: 'userActions' })
        return;
      })
}

const modeleDownloaded = () => ({
  type: MODELE_DOWNLOADED
})

const cancelDownloadModel = () => ({
  type: CANCEL_DOWNLOAD_MODELE
})

const downloadModele = (nb, total) => ({
  type: DOWNLOADING_MODELE,
  nb,
  total
})

export const uploadingFile = (fileId) => ({
  type: UPLOADING_FILE,
  fileId
})

export const cancelUploadingFile = (fileId) => ({
  type: CANCEL_UPLOAD,
  fileId
})

export const uploadFile = (filePath, file) => async (dispatch) => {
  const { user } = store.getState();
  return RNFetchBlob.config({ timeout: 60000 }).fetch('PUT', `${API_URL}/api/pdffile/upload/${file.id}`, {
    Authorization: `Bearer ${user.bearerToken}`,
    'Content-Type': 'multipart/form-data',
    'ID_Affaire': file.dossier1,
    'Doss1': file.dossier1,
    'Doss2': file.dossier2,
    'ID_Document': file.id,
    'Extension': file.extension
  }, [{
    name: file.fileName,
    filename: `${file.id}.${file.extension}`,
    data: RNFetchBlob.wrap(filePath)
  }])
  .then(() => {
    return api.put(`/api/documents/${file.id}`, { ...file }, { headers: { Authorization: `Bearer ${user.bearerToken}` } })
      .then(() => {
        dispatch(removeFromEdit(file.id))
      })
  })
  .catch((e) => {
    Sentry.captureException(e, { func: 'uploadFile', doc: 'userActions' })
    return dispatch(cancelUploadingFile(file.id))
  })
}

export const removeFromEdit = (id) => ({
  type: REMOVE_EDIT_FILE,
  id
})

export const createFile = (filePath, file) => (dispatch) => {
  const { user } = store.getState();
  return RNFetchBlob.config({ timeout: 60000 }).fetch('PUT', `${API_URL}/api/pdffile/upload/${file.id}`, {
    Authorization: `Bearer ${user.bearerToken}`,
    'Content-Type': 'multipart/form-data',
    'ID_Affaire': file.dossier1,
    'Doss1': file.dossier1,
    'Doss2': file.dossier2,
    'ID_Document': file.id,
    'Extension': file.extension
  }, [{
    name: file.fileName,
    filename: `${file.id}.${file.extension}`,
    data: RNFetchBlob.wrap(filePath)
  }])
  .then(() => {
    return api.post(`/api/documents/${file.id}`, { ...file }, { headers: { Authorization: `Bearer ${user.bearerToken}` }})
      .then(() => {
        dispatch(removeNewDoc(file.id))
        dispatch(addDoc(file))
        dispatch(removeFromEdit(file.id))
      })
  })
  .catch((e) => {
    Sentry.captureException(e, { func: 'createFile', doc: 'userActions' })
    return dispatch(cancelUploadingFile(file.id))
  })
}

export const uploadingMulti = (uploads) => ({
  type: MULTI_UPLOAD,
  uploads
})


export const uploadMultipleFiles = (files) => async (dispatch) => {
  const { user } = store.getState();
  for (let i = 0; i < files.length; i++) {
    try {
      await RNFetchBlob.config({ timeout: 60000 }).fetch('PUT', `${API_URL}/api/pdffile/upload/${files[i].id}`, {
        Authorization: `Bearer ${user.bearerToken}`,
        'Content-Type': 'multipart/form-data',
        'ID_Affaire': files[i].dossier1,
        'Doss1': files[i].dossier1,
        'Doss2': files[i].dossier2,
        'ID_Document': files[i].id,
        'Extension': files[i].extension
      }, [{
        name: files[i].fileName,
        filename: `${files[i].id}.${files[i].extension}`,
        data: RNFetchBlob.wrap(files[i].filePath)
      }])
      if (files[i].isNew) {
        api.post(`/api/documents/${files[i].id}`, { ...files[i] }, { headers: { Authorization: `Bearer ${user.bearerToken}` } })
          .then(() => {
            dispatch(removeNewDoc(files[i].id))
            dispatch(addDoc(files[i]))
            dispatch(removeFromEdit(files[i].id))
          })
      } else {
        api.put(`/api/documents/${files[i].id}`, { ...files[i] }, { headers: { Authorization: `Bearer ${user.bearerToken}` } })
          .then(() => {
            dispatch(removeFromEdit(files[i].id))
          })
      }
    } catch (e) {
      Sentry.captureException(e, { func: 'uploadMultipleFiles', doc: 'userActions' })
      return dispatch(cancelUploadingFile(files[i].id))
    }
  }
}

