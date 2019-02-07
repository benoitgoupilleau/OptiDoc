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
  REMOVE_EDIT_FILE,
  UPLOADING_FILE,
  CANCEL_UPLOAD,
  REMOVE_EDIT_PREPARE
} from './types';

import { removeNewDoc, addDoc } from './business'

import Folder from '../../constants/Folder'
import Tables from '../../constants/Tables';

const rootDir = RNFS.DocumentDirectoryPath;

export const login = (userName, user, bearerToken) => ({
  type: LOGIN,
  userName,
  bearerToken,
  id: user.ID,
  id_employe: user.ID_Employe,
  name: user.Nom
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
  MSSQL.executeUpdate(`UPDATE ${Tables.t_docs} SET Locked='O' WHERE ID='${file.ID}'`)
  return ({
    type: EDIT_FILE,
    file
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

export const cancelUploadingFile = (fileId) => ({
  type: CANCEL_UPLOAD,
  fileId
})

export const uploadFile = (filePath, file, remoteDir) => async (dispatch) => FTP.login(FTP_USERNAME, FTP_PASSWORD)
  .then(() => FTP.uploadFile(filePath, remoteDir)
    .then(() => {
      //MSSQL update
      return MSSQL.executeUpdate(`UPDATE ${Tables.t_docs} SET UpLoadedOn='${file.UpLoadedOn}', UpdatedOn='${file.UpdatedOn}', UpdatedBy='${file.UpdatedBy}', UpLoadedBy='${file.UpLoadedBy}', Prepared='${file.Prepared}', PreparedOn='${file.PreparedOn}', Locked='N' WHERE ID='${file.ID}'`)
        .then(() => dispatch(removeFromEdit(file.ID)))
    }))
  .catch((e) => {
    dispatch(cancelUploadingFile(file.ID))
    console.log({ uploadFile: e })
  })

export const removeFromEdit = (id) => ({
  type: REMOVE_EDIT_FILE,
  id
})

export const downLoadOneFile = (serverPath, localPath) => async () => {
  await FTP.login(FTP_USERNAME, FTP_PASSWORD);
  await FTP.downloadFile(serverPath,localPath)
  await FTP.logout()
  return true
}

export const createFile = (filePath, file, remoteDir) => async (dispatch) => FTP.login(FTP_USERNAME, FTP_PASSWORD)
  .then(() => FTP.uploadFile(filePath, remoteDir)
    .then(() => {
      //MSSQL update
      return MSSQL.executeUpdate(`INSERT INTO ${Tables.t_docs} 
        (LocalPath, Prepared, PreparedOn, PageNumber, ReviewedOn, PreparedBy, Revisable, Size, CreatedBy, Dossier2, UpLoadedOn, FileName, CreatedOn, Dossier1, ID, UpdatedOn, UpdatedBy, Commentaire, Dossier3, ServerPath, ReviewedBy, Extension, Reviewed, Locked, UpLoadedBy) 
        VALUES ('${file.LocalPath}', '${file.Prepared}', '${file.PreparedOn}', '${file.PageNumber}', '${file.ReviewedOn}', '${file.PreparedBy}', '${file.Revisable}', '${file.Size}', '${file.CreatedBy}', '${file.Dossier2}', '${file.UpLoadedOn}', '${file.FileName}', '${file.CreatedOn}', '${file.Dossier1}', '${file.ID}', '${file.UpdatedOn}', '${file.UpdatedBy}', '${file.Commentaire}', '${file.Dossier3}', '${file.ServerPath}', '${file.ReviewedBy}', '${file.Extension}', '${file.Reviewed}', '${file.Locked}', '${file.UpLoadedBy}');`)
        .then(() => {
          dispatch(removeNewDoc(file.ID))
          dispatch(addDoc(file))
          dispatch(removeFromEdit(file.ID))
        })
    }))
  .catch((e) => {
    dispatch(cancelUploadingFile(file.ID))
    console.log({ createFile: e })
  })