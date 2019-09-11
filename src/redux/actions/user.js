import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import Sentry from '../../services/sentry';
import api from '../../services/api';

import { store } from '../store/store';

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

import { removeNewDoc, addDoc } from './business';

import Folder from '../../constants/Folder';

import rootDir from '../../services/rootDir';

export const loginApi = (
  userName,
  MdP,
  url,
  successCallback,
  errorCallback
) => dispatch =>
  api
    .post(`${url}/api/login`, { login: userName, MdP })
    .then(res => {
      const { username, id_user, token } = res.data;
      successCallback();
      return dispatch(setUser(userName, id_user, token, username, url));
    })
    .catch(() => {
      return errorCallback();
    });

const setUser = (userName, userId, bearerToken, name, url) => ({
  type: LOGIN,
  userName,
  bearerToken,
  userId,
  name,
  url
});

export const logout = () => ({
  type: LOGOUT
});

export const sessionExpired = () => ({
  type: SESSION_EXPIRED
});

export const downLoadOneFile = (
  ID,
  Extension,
  type,
  businessId
) => async dispatch => {
  const { user } = store.getState();
  const apiUrl = user.url;
  const destinationFolder = `${rootDir}/${user.userId}/${businessId}`;
  dispatch(downloadingFile(ID));
  return RNFetchBlob.config({
    timeout: 60000,
    path: `${destinationFolder}/${type}/${ID}.${Extension}`
  })
    .fetch('GET', `${apiUrl}/api/pdffile/download/${ID}`, {
      Authorization: `Bearer ${user.bearerToken}`
    })
    .then(() => {
      return dispatch(fileDownloaded(ID));
    })
    .catch(e => {
      Sentry.captureException(e, {
        func: 'downLoadOneFile',
        doc: 'userActions'
      });
      dispatch(cancelDownloadOneFile(ID));
      return;
    });
};

const downloadingFile = ID => ({
  type: DOWNLOADING_FILE,
  ID
});

const cancelDownloadOneFile = ID => ({
  type: CANCEL_DOWNLOAD_FILE,
  ID
});

const fileDownloaded = ID => ({
  type: FILE_DOWNLOADED,
  ID
});

export const downloadBusiness = (userId, businessId, prep, rea) => dispatch => {
  dispatch(downloading(businessId, 0, 0, prep, rea));
  const { user } = store.getState();
  const apiUrl = user.url;
  const total = prep.length + rea.length;
  const destinationFolder = `${rootDir}/${userId}/${businessId}`;
  return RNFS.mkdir(destinationFolder)
    .then(async () => {
      let nbDownloading = 0;
      if (prep.length > 0) {
        await RNFS.mkdir(`${destinationFolder}/${Folder.prep}`);
        for (let i = 0; i < prep.length; i += 1) {
          try {
            const fileExists = await RNFS.exists(
              `${destinationFolder}/${Folder.prep}/${prep[i].ID}.${prep[i].Extension}`
            );
            nbDownloading = nbDownloading + 1;
            dispatch(downloading(businessId, nbDownloading, total));
            if (!fileExists) {
              dispatch(downloadingFile(prep[i].ID));
              await RNFetchBlob.config({
                timeout: 60000,
                path: `${destinationFolder}/${Folder.prep}/${prep[i].ID}.${prep[i].Extension}`
              }).fetch('GET', `${apiUrl}/api/pdffile/download/${prep[i].ID}`, {
                Authorization: `Bearer ${user.bearerToken}`
              });
              dispatch(fileDownloaded(prep[i].ID));
            }
          } catch (error) {
            Sentry.captureException(error, {
              prepDoc: prep[i],
              func: 'downloadFile',
              doc: 'userActions'
            });
            dispatch(cancelDownloadOneFile(prep[i].ID));
          }
        }
      }
      if (rea.length > 0) {
        await RNFS.mkdir(`${destinationFolder}/${Folder.rea}`);
        for (let i = 0; i < rea.length; i += 1) {
          try {
            const fileExists = await RNFS.exists(
              `${destinationFolder}/${Folder.rea}/${rea[i].ID}.${rea[i].Extension}`
            );
            nbDownloading = nbDownloading + 1;
            dispatch(downloading(businessId, nbDownloading, total));
            if (!fileExists) {
              dispatch(downloadingFile(rea[i].ID));
              await RNFetchBlob.config({
                timeout: 60000,
                path: `${destinationFolder}/${Folder.rea}/${rea[i].ID}.${rea[i].Extension}`
              }).fetch('GET', `${apiUrl}/api/pdffile/download/${rea[i].ID}`, {
                Authorization: `Bearer ${user.bearerToken}`
              });
              dispatch(fileDownloaded(rea[i].ID));
            }
          } catch (error) {
            Sentry.captureException(error, {
              reaDoc: rea[i],
              func: 'downloadFile',
              doc: 'userActions'
            });
            dispatch(cancelDownloadOneFile(rea[i].ID));
          }
        }
      }
      return dispatch(businessDownloaded(businessId));
    })
    .catch(async e => {
      Sentry.captureException(e, {
        func: 'downloadBusiness',
        doc: 'userActions'
      });
      for (let i = 0; i < prep.length; i += 1) {
        dispatch(cancelDownloadOneFile(prep[i].ID));
      }
      for (let i = 0; i < rea.length; i += 1) {
        dispatch(cancelDownloadOneFile(rea[i].ID));
      }
      console.log({ e });
      return dispatch(cancelDownload(businessId));
    });
};

const cancelDownload = ID => ({
  type: CANCEL_DOWNLOAD,
  ID
});

const downloading = (ID, nb, total, prep, rea) => {
  if (prep && rea) {
    return {
      type: DOWNLOADING_BUSINESS,
      ID,
      nb,
      total,
      upForDownload: prep.map(d => d.ID).concat(rea.map(d => d.ID))
    };
  }
  return {
    type: DOWNLOADING_BUSINESS,
    ID,
    nb,
    total
  };
};

const businessDownloaded = ID => ({
  type: BUSINESS_DOWNLOADED,
  ID
});

export const editPrepare = file => ({
  type: EDIT_FILE,
  file
});

export const removePrepare = ID => ({
  type: REMOVE_EDIT_PREPARE,
  ID
});

export const editFile = (file, filePath) => {
  FileViewer.open(filePath, { showOpenWithDialog: true });
  return {
    type: EDIT_FILE,
    file
  };
};

export const forceDownloadModels = modeleDocs => dispatch => {
  const { user } = store.getState();
  const apiUrl = user.url;
  const destinationFolder = `${rootDir}/${Folder.modeleDocs}`;
  const total = modeleDocs.length;
  return RNFS.mkdir(destinationFolder)
    .then(async () => {
      for (let i = 0; i < modeleDocs.length; i += 1) {
        dispatch(downloadModele(i + 1, total));
        await RNFetchBlob.config({
          timeout: 60000,
          path: `${destinationFolder}/${modeleDocs[i].ID_Document}.pdf`
        }).fetch(
          'GET',
          `${apiUrl}/api/pdffile/download/${modeleDocs[i].ID_Document}`,
          {
            Authorization: `Bearer ${user.bearerToken}`
          }
        );
      }
      return dispatch(modeleDownloaded());
    })
    .catch(e => {
      dispatch(cancelDownloadModel());
      Sentry.captureException(e, {
        func: 'forceDownloadModels',
        doc: 'userActions'
      });
      return;
    });
};

export const downloadModels = modeleDocs => dispatch => {
  const { user } = store.getState();
  const apiUrl = user.url;
  const total = modeleDocs.length;
  const destinationFolder = `${rootDir}/${Folder.modeleDocs}`;
  return RNFS.mkdir(destinationFolder)
    .then(async () => {
      for (let i = 0; i < modeleDocs.length; i += 1) {
        const fileExists = await RNFS.exists(
          `${destinationFolder}/${modeleDocs[i].ID_Document}.pdf`
        );
        if (!fileExists) {
          dispatch(downloadModele(i + 1, total));
          await RNFetchBlob.config({
            timeout: 60000,
            path: `${destinationFolder}/${modeleDocs[i].ID_Document}.pdf`
          }).fetch(
            'GET',
            `${apiUrl}/api/pdffile/download/${modeleDocs[i].ID_Document}`,
            {
              Authorization: `Bearer ${user.bearerToken}`
            }
          );
        }
      }
      return dispatch(modeleDownloaded());
    })
    .catch(e => {
      dispatch(cancelDownloadModel());
      Sentry.captureException(e, {
        func: 'downloadModels',
        doc: 'userActions'
      });
      return;
    });
};

const modeleDownloaded = () => ({
  type: MODELE_DOWNLOADED
});

const cancelDownloadModel = () => ({
  type: CANCEL_DOWNLOAD_MODELE
});

const downloadModele = (nb, total) => ({
  type: DOWNLOADING_MODELE,
  nb,
  total
});

export const uploadingFile = fileId => ({
  type: UPLOADING_FILE,
  fileId
});

export const cancelUploadingFile = fileId => ({
  type: CANCEL_UPLOAD,
  fileId
});

export const uploadFile = (filePath, file) => async dispatch => {
  const { user } = store.getState();
  const apiUrl = user.url;
  return RNFetchBlob.config({ timeout: 60000 })
    .fetch(
      'POST',
      `${apiUrl}/api/pdffile/upload`,
      {
        Authorization: `Bearer ${user.bearerToken}`,
        'Content-Type': 'multipart/form-data',
        ID_Affaire: file.Dossier1,
        Doss1: file.Dossier2,
        Doss2: file.Dossier3,
        ID_Document: file.ID,
        Extension: file.Extension
      },
      [
        {
          name: 'file',
          filename: `${file.FileName}.${file.Extension}`,
          type: 'application/pdf',
          data: `RNFetchBlob-file://${filePath}`
        }
      ]
    )
    .then(res => {
      const info = res.info();
      if (info && info.status === 200) {
        return api
          .put(
            `${apiUrl}/api/documents/${file.ID}`,
            { ...file },
            { headers: { Authorization: `Bearer ${user.bearerToken}` } }
          )
          .then(() => {
            return dispatch(removeFromEdit(file.ID));
          });
      }
      Sentry.captureMessage(info, {
        func: 'uploadFile',
        doc: 'userActions',
        status: 'upload failed'
      });
      return dispatch(cancelUploadingFile(file.ID));
    })
    .catch(e => {
      Sentry.captureException(e, { func: 'uploadFile', doc: 'userActions' });
      return dispatch(cancelUploadingFile(file.ID));
    });
};

export const removeFromEdit = ID => ({
  type: REMOVE_EDIT_FILE,
  ID
});

export const createFile = (filePath, file) => dispatch => {
  const { user } = store.getState();
  const apiUrl = user.url;
  return RNFetchBlob.config({ timeout: 60000 })
    .fetch(
      'POST',
      `${apiUrl}/api/pdffile/upload`,
      {
        Authorization: `Bearer ${user.bearerToken}`,
        'Content-Type': 'multipart/form-data',
        ID_Affaire: file.Dossier1,
        Doss1: file.Dossier2,
        Doss2: file.Dossier3,
        ID_Document: file.ID,
        Extension: file.Extension
      },
      [
        {
          name: 'file',
          filename: `${file.FileName}.pdf`,
          type: 'application/pdf',
          data: `RNFetchBlob-file://${filePath}`
        }
      ]
    )
    .then(res => {
      const info = res.info();
      if (info && info.status === 200) {
        return api
          .post(
            `${apiUrl}/api/documents/${file.ID}`,
            { ...file },
            { headers: { Authorization: `Bearer ${user.bearerToken}` } }
          )
          .then(() => {
            dispatch(removeNewDoc(file.ID));
            dispatch(addDoc(file));
            return dispatch(removeFromEdit(file.ID));
          });
      }
      Sentry.captureMessage(info, {
        func: 'createFile',
        doc: 'userActions',
        status: 'upload failed'
      });
      return dispatch(cancelUploadingFile(file.ID));
    })
    .catch(e => {
      dispatch(cancelUploadingFile(file.ID));
      Sentry.captureException(e, { func: 'createFile', doc: 'userActions' });
      return;
    });
};

export const uploadingMulti = uploads => ({
  type: MULTI_UPLOAD,
  uploads
});

export const uploadMultipleFiles = files => async dispatch => {
  const { user } = store.getState();
  const apiUrl = user.url;
  for (let i = 0; i < files.length; i++) {
    try {
      const res = await RNFetchBlob.config({ timeout: 60000 }).fetch(
        'POST',
        `${apiUrl}/api/pdffile/upload`,
        {
          Authorization: `Bearer ${user.bearerToken}`,
          'Content-Type': 'multipart/form-data',
          ID_Affaire: files[i].Dossier1,
          Doss1: files[i].Dossier2,
          Doss2: files[i].Dossier3,
          ID_Document: files[i].ID,
          Extension: files[i].Extension
        },
        [
          {
            name: 'file',
            filename: `${files[i].FileName}.pdf`,
            type: 'application/pdf',
            data: `RNFetchBlob-file://${files[i].filePath}`
          }
        ]
      );
      const info = res.info();
      if (info && info.status === 200) {
        if (files[i].isNew) {
          api
            .post(
              `${apiUrl}/api/documents/${files[i].ID}`,
              { ...files[i] },
              { headers: { Authorization: `Bearer ${user.bearerToken}` } }
            )
            .then(() => {
              dispatch(removeNewDoc(files[i].ID));
              dispatch(addDoc(files[i]));
              dispatch(removeFromEdit(files[i].ID));
            });
        } else {
          api
            .put(
              `${apiUrl}/api/documents/${files[i].ID}`,
              { ...files[i] },
              { headers: { Authorization: `Bearer ${user.bearerToken}` } }
            )
            .then(() => {
              dispatch(removeFromEdit(files[i].ID));
            });
        }
      } else {
        Sentry.captureMessage(info, {
          func: 'uploadMultipleFiles',
          doc: 'userActions',
          status: 'upload failed'
        });
        dispatch(cancelUploadingFile(files[i].ID));
      }
    } catch (e) {
      Sentry.captureException(e, {
        func: 'uploadMultipleFiles',
        doc: 'userActions'
      });
      return dispatch(cancelUploadingFile(files[i].ID));
    }
  }
};
