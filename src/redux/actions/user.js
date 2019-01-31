import RNFS from 'react-native-fs';
import FTP from '../../services/ftp';
import { FTP_USERNAME, FTP_PASSWORD } from 'react-native-dotenv';
import FileViewer from 'react-native-file-viewer';
import MSSQL from '../../services/mssql';

import {
  LOGIN,
  LOGOUT,
  BUSINESS_DOWNLOADED,
  DOWNLOADING_BUSINESS,
  CANCEL_DOWNLOAD,
  EDIT_FILE,
  DOWNLOADING_MODELE,
  CANCEL_DOWNLOAD_MODELE,
  MODELE_DOWNLOADED,
  UPLOADED_FILE,
  UPLOADING_FILE
} from './types';

import Folder from '../../constants/Folder'
import Tables from '../../constants/Tables';

const rootDir = RNFS.DocumentDirectoryPath;

export const login = (email, user, bearerToken) => ({
  type: LOGIN,
  email,
  bearerToken,
  id: user.ID,
  lastName: user.Nom,
  firstName: user.Prenom
}) 

export const logout = (userId) => dispatch => RNFS.unlink(`${rootDir}/${userId}`)
  .then(() => dispatch({type: LOGOUT}))
  .catch(() => dispatch({ type: LOGOUT }))

export const downloadBusiness = (userId, businessId, prep, rea, modeleDocs) => dispatch => {
  dispatch(downloading(businessId))
  return RNFS.mkdir(`${rootDir}/${userId}/${businessId}`)
  .then(async () => {
    await FTP.login(FTP_USERNAME, FTP_PASSWORD);
    if (prep.length > 0) {
      await RNFS.mkdir(`${rootDir}/${userId}/${businessId}/${Folder.prep}`);
      for (let i = 0; i < prep.length; i += 1) {
        await FTP.downloadFile(`./${prep[i].ServerPath}`,
          `${rootDir}/${userId}/${businessId}/${Folder.prep}`)
      }
    }
    if (rea.length > 0) {
      await RNFS.mkdir(`${rootDir}/${userId}/${businessId}/${Folder.rea}`);
      for (let i = 0; i < rea.length; i += 1) {
        await FTP.downloadFile(`./${rea[i].ServerPath}`,
          `${rootDir}/${userId}/${businessId}/${Folder.rea}`)
      }
    }
    if (modeleDocs.length > 0) {
      dispatch(downloadModele())
      await RNFS.mkdir(`${rootDir}/${userId}/${Folder.modeleDocs}`);
      for (let i = 0; i < modeleDocs.length; i += 1) {
        const fileExists = await RNFS.exists(`${rootDir}/${userId}/${Folder.modeleDocs}/${modeleDocs[i].ID}.${modeleDocs[i].Extension}`)
        if (!fileExists) {
          await FTP.downloadFile(`./${modeleDocs[i].ServerPath}`,
            `${rootDir}/${userId}/${Folder.modeleDocs}`)
        }
      }
      dispatch(modeleDownloaded())
    }
    await FTP.logout()
    return dispatch(businessDownloaded(businessId))
  }).catch(async (e) => {
    dispatch(cancelDownload(businessId))
    dispatch(cancelDownloadModel())
    await FTP.logout()
    console.log({ downloadBusiness: e})
  })
}

const cancelDownload = (id) => ({
  type: CANCEL_DOWNLOAD,
  id
})

const downloading = (id) => ({
  type: DOWNLOADING_BUSINESS,
  id
})

const businessDownloaded = (id) => ({
  type: BUSINESS_DOWNLOADED,
  id
})

export const editFile = (fileId, filePath) => {
  FileViewer.open(filePath, { showOpenWithDialog: true });
  return ({
    type: EDIT_FILE,
    fileId
  })
}

export const downloadModels = (userId, modeleDocs) => dispatch => {
  return RNFS.mkdir(`${rootDir}/${userId}/${Folder.modeleDocs}`)
    .then(async () => {
      await FTP.login(FTP_USERNAME, FTP_PASSWORD);
      if (modeleDocs.length > 0) {
        dispatch(downloadModele())
        for (let i = 0; i < modeleDocs.length; i += 1) {
          const fileExists = await RNFS.exists(`${rootDir}/${userId}/${Folder.modeleDocs}/${modeleDocs[i].ID}.${modeleDocs[i].Extension}`)
          if (!fileExists) {
            await FTP.downloadFile(`./${modeleDocs[i].ServerPath}`,
              `${rootDir}/${userId}/${Folder.modeleDocs}`)
          }
        }
      }
      await FTP.logout()
      return dispatch(modeleDownloaded())
    }).catch(async (e) => {
      dispatch(cancelDownloadModel())
      await FTP.logout()
      console.log({ downloadModels: e })
    })
}

const modeleDownloaded = () => ({
  type: MODELE_DOWNLOADED
})

const cancelDownloadModel = () => ({
  type: CANCEL_DOWNLOAD_MODELE
})

const downloadModele = () => ({
  type: DOWNLOADING_MODELE
})

export const uploadingFile = (fileId) => ({
  type: UPLOADING_FILE,
  fileId
})

export const uploadFile = (filePath, file, remoteDir) => async (dispatch) => FTP.login(FTP_USERNAME, FTP_PASSWORD)
  .then(() => FTP.uploadFile(filePath, remoteDir)
    .then(() => {
      //MSSQL update
      return MSSQL.executeUpdate(`UPDATE ${Tables.t_docs} SET UpLoadedOn='${file.UpLoadedOn}', UpdatedOn='${file.UpdatedOn}', UpdatedBy='${file.UpdatedBy}', UpLoadedBy='${file.UpLoadedBy}' WHERE ID='${file.ID}'`)
        .then(() => dispatch(uploadedFile(file.ID)))
    }))
  .catch((e) => console.log({ uploadFile: e }))

const uploadedFile = (id) => ({
  type: UPLOADED_FILE,
  id
})