import RNFS from 'react-native-fs';
import omit from 'lodash.omit';
import FTP from '../../services/ftp';
import { FTP_USERNAME, FTP_PASSWORD } from 'react-native-dotenv';
import FileViewer from 'react-native-file-viewer';
import MSSQL_Out from '../../services/mssqlOut';
import MSSQL_Home from '../../services/mssqlHome';
import Sentry from '../../services/sentry'

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
  REMOVE_EDIT_PREPARE,
  CANCEL_DOWNLOAD_FILE,
  FILE_DOWNLOADED,
  DOWNLOADING_FILE,
  MULTI_UPLOAD
} from './types';

import { removeNewDoc, addDoc } from './business'

import Folder from '../../constants/Folder'
import Tables from '../../constants/Tables';

import rootDir from '../../services/rootDir';

let isDownloadingFiles = false;
let isDownloadingModeles = false;

export const login = (userName, user, bearerToken) => ({
  type: LOGIN,
  userName,
  bearerToken,
  id: user.ID,
  id_employe: user.ID_Employe,
  name: user.Nom
}) 

export const logout = () => ({
  type: LOGOUT
});

export const downLoadOneFile = (id, serverPath, localPath) => dispatch => {
  if (isDownloadingFiles) {
    return dispatch(cancelDownloadOneFile(id))
  }
  return FTP.login(FTP_USERNAME, FTP_PASSWORD)
    .then(() => {
      dispatch(downloadingFile(id))
      return FTP.downloadFile(serverPath, localPath).then(async () => {
        await FTP.logout()
        return dispatch(fileDownloaded(id))
      })
    })
    .catch(async (e) => {
      Sentry.captureException(e, { func: 'downLoadOneFile', doc: 'userActions' })
      isDownloadingFiles = false;
      await FTP.logout()
      return dispatch(cancelDownloadOneFile(id))
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
  if (isDownloadingModeles) {
    return dispatch(cancelDownload(businessId))
  }
  isDownloadingFiles = true;
  dispatch(downloading(businessId, 0, 0))
  return RNFS.mkdir(`${rootDir}/${userId}/${businessId}`)
    .then(() => FTP.login(FTP_USERNAME, FTP_PASSWORD).then(async () => {
      const total = prep.length + rea.length;
      let nbDownloading = 0
      if (prep.length > 0) {
        await RNFS.mkdir(`${rootDir}/${userId}/${businessId}/${Folder.prep}`);
        for (let i = 0; i < prep.length; i += 1) {
          try {
            const fileExists = await RNFS.exists(`${rootDir}/${userId}/${businessId}/${Folder.prep}/${prep[i].ID}.${prep[i].Extension}`)
            nbDownloading = nbDownloading + 1;
            dispatch(downloading(businessId, nbDownloading, total))
            if (!fileExists) {
              await FTP.downloadFile(`./${prep[i].ServerPath}`, `${rootDir}/${userId}/${businessId}/${Folder.prep}`)
            }
          } catch (error) {
            Sentry.captureException(error, { prepDoc: prep[i], func: "FTP.downloadFile", doc: 'userActions' })
            return dispatch(cancelDownload(businessId))
          }
        }
      }
      if (rea.length > 0) {
        await RNFS.mkdir(`${rootDir}/${userId}/${businessId}/${Folder.rea}`);
        for (let i = 0; i < rea.length; i += 1) {
          try {
            const fileExists = await RNFS.exists(`${rootDir}/${userId}/${businessId}/${Folder.rea}/${rea[i].ID}.${rea[i].Extension}`)
            nbDownloading = nbDownloading + 1;
            dispatch(downloading(businessId, nbDownloading, total))
            if (!fileExists) {
              await FTP.downloadFile(`./${rea[i].ServerPath}`, `${rootDir}/${userId}/${businessId}/${Folder.rea}`)
            }
          } catch (error) {
            Sentry.captureException(error, { reaDoc: rea[i], func: "FTP.downloadFile", doc: 'userActions' })
            return dispatch(cancelDownload(businessId))
          }
        }
      }
      isDownloadingFiles = false;
      await FTP.logout()
      return dispatch(businessDownloaded(businessId))
    })
    ).catch(async (e) => {
      Sentry.captureException(e, { func: 'downloadBusiness', doc: 'userActions' })
      isDownloadingFiles = false;
      await FTP.logout()
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

export const downloadModels = (modeleDocs) => dispatch => {
  if (isDownloadingFiles) {
    return dispatch(cancelDownloadModel())
  }
  isDownloadingModeles = true;
  return RNFS.mkdir(`${rootDir}/${Folder.modeleDocs}`)
    .then(() => FTP.login(FTP_USERNAME, FTP_PASSWORD).then(async () => {
      if (modeleDocs.length > 0) {
        const total = modeleDocs.length;
        for (let i = 0; i < modeleDocs.length; i += 1) {
          const fileExists = await RNFS.exists(`${rootDir}/${Folder.modeleDocs}/${modeleDocs[i].ID}.${modeleDocs[i].Extension}`)
          if (!fileExists) {
            try {
              dispatch(downloadModele(i+1, total))
              await FTP.downloadFile(`./${modeleDocs[i].ServerPath}`, `${rootDir}/${Folder.modeleDocs}`)
            } catch (error) {
              await RNFS.unlink(`${rootDir}/${Folder.modeleDocs}/${modeleDocs[i].ID}.${modeleDocs[i].Extension}`)
              Sentry.captureException(error, { modeleDoc: modeleDocs[i], func: "FTP.downloadFile", doc: 'userActions' })
            }
          }
        }
      }
      isDownloadingModeles = false;
      await FTP.logout()
      return dispatch(modeleDownloaded())
      })
    ).catch(async (e) => {
      dispatch(cancelDownloadModel())
      isDownloadingModeles = false;
      Sentry.captureException(e, { func: 'downloadModels', doc: 'userActions' })
      return await FTP.logout()
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

export const uploadFile = (connectedHome = false, filePath, file, remoteDir) => async (dispatch) => FTP.login(FTP_USERNAME, FTP_PASSWORD)
  .then(() => FTP.makedir(remoteDir)
    .then(() => FTP.uploadFile(filePath, remoteDir)
      .then(() => {
        //MSSQL update
        if (connectedHome) {
          return MSSQL_Home.executeUpdate(`UPDATE ${Tables.t_docs} SET UpLoadedOn='${file.UpLoadedOn}', UpdatedOn='${file.UpdatedOn}', UpdatedBy='${file.UpdatedBy}', UpLoadedBy='${file.UpLoadedBy}', Prepared='${file.Prepared}', PreparedOn='${file.PreparedOn}', PreparedBy='${file.PreparedBy}' WHERE ID='${file.ID}'`)
            .then(() => dispatch(removeFromEdit(file.ID)))
        }
        return MSSQL_Out.executeUpdate(`UPDATE ${Tables.t_docs} SET UpLoadedOn='${file.UpLoadedOn}', UpdatedOn='${file.UpdatedOn}', UpdatedBy='${file.UpdatedBy}', UpLoadedBy='${file.UpLoadedBy}', Prepared='${file.Prepared}', PreparedOn='${file.PreparedOn}', PreparedBy='${file.PreparedBy}' WHERE ID='${file.ID}'`)
          .then(() => dispatch(removeFromEdit(file.ID)))
      })))
  .catch((e) => {
    Sentry.captureException(e, { func: 'uploadFile', doc: 'userActions' })
    return dispatch(cancelUploadingFile(file.ID))
  })

export const removeFromEdit = (id) => ({
  type: REMOVE_EDIT_FILE,
  id
})

export const createFile = (connectedHome = false, filePath, file, remoteDir) => (dispatch) => FTP.login(FTP_USERNAME, FTP_PASSWORD)
  .then(() => FTP.makedir(remoteDir)
    .then(() => FTP.uploadFile(filePath, remoteDir)
      .then(() => {
        //MSSQL update
        if (connectedHome) {
          return MSSQL_Home.executeUpdate(`INSERT INTO ${Tables.t_docs} 
          (LocalPath, Prepared, PreparedOn, PageNumber, ReviewedOn, PreparedBy, Revisable, Size, CreatedBy, Dossier2, UpLoadedOn, FileName, CreatedOn, Dossier1, ID, UpdatedOn, UpdatedBy, Commentaire, Dossier3, ServerPath, ReviewedBy, Extension, Reviewed, Locked, UpLoadedBy) 
          VALUES ('${file.LocalPath}', '${file.Prepared}', '${file.PreparedOn}', '${file.PageNumber}', '${file.ReviewedOn}', '${file.PreparedBy}', '${file.Revisable}', '${file.Size}', '${file.CreatedBy}', '${file.Dossier2}', '${file.UpLoadedOn}', '${file.FileName}', '${file.CreatedOn}', '${file.Dossier1}', '${file.ID}', '${file.UpdatedOn}', '${file.UpdatedBy}', '${file.Commentaire}', '${file.Dossier3}', '${file.ServerPath}', '${file.ReviewedBy}', '${file.Extension}', '${file.Reviewed}', '${file.Locked}', '${file.UpLoadedBy}');`)
            .then(() => {
              dispatch(removeNewDoc(file.ID))
              dispatch(addDoc(file))
              dispatch(removeFromEdit(file.ID))
            })
        }
        return MSSQL_Out.executeUpdate(`INSERT INTO ${Tables.t_docs} 
          (LocalPath, Prepared, PreparedOn, PageNumber, ReviewedOn, PreparedBy, Revisable, Size, CreatedBy, Dossier2, UpLoadedOn, FileName, CreatedOn, Dossier1, ID, UpdatedOn, UpdatedBy, Commentaire, Dossier3, ServerPath, ReviewedBy, Extension, Reviewed, Locked, UpLoadedBy) 
          VALUES ('${file.LocalPath}', '${file.Prepared}', '${file.PreparedOn}', '${file.PageNumber}', '${file.ReviewedOn}', '${file.PreparedBy}', '${file.Revisable}', '${file.Size}', '${file.CreatedBy}', '${file.Dossier2}', '${file.UpLoadedOn}', '${file.FileName}', '${file.CreatedOn}', '${file.Dossier1}', '${file.ID}', '${file.UpdatedOn}', '${file.UpdatedBy}', '${file.Commentaire}', '${file.Dossier3}', '${file.ServerPath}', '${file.ReviewedBy}', '${file.Extension}', '${file.Reviewed}', '${file.Locked}', '${file.UpLoadedBy}');`)
          .then(() => {
            dispatch(removeNewDoc(file.ID))
            dispatch(addDoc(file))
            dispatch(removeFromEdit(file.ID))
          })
      })))
  .catch((e) => {
    Sentry.captureException(e, { func: 'createFile', doc: 'userActions' })
    return dispatch(cancelUploadingFile(file.ID))
  })

export const uploadingMulti = (uploads) => ({
  type: MULTI_UPLOAD,
  uploads
})


export const uploadMultipleFiles = (connectedHome = false, files) => (dispatch) => FTP.login(FTP_USERNAME, FTP_PASSWORD)
  .then(async () => {
    for (let i = 0; i < files.length; i++) {
      try {
        await FTP.makedir(files[i].remoteDir);
        await FTP.uploadFile(files[i].filePath, files[i].remoteDir);
        if (files[i].isNew) {
          if (connectedHome) {
            MSSQL_Home.executeUpdate(`INSERT INTO ${Tables.t_docs} 
            (LocalPath, Prepared, PreparedOn, PageNumber, ReviewedOn, PreparedBy, Revisable, Size, CreatedBy, Dossier2, UpLoadedOn, FileName, CreatedOn, Dossier1, ID, UpdatedOn, UpdatedBy, Commentaire, Dossier3, ServerPath, ReviewedBy, Extension, Reviewed, Locked, UpLoadedBy) 
            VALUES ('${files[i].LocalPath}', '${files[i].Prepared}', '${files[i].PreparedOn}', '${files[i].PageNumber}', '${files[i].ReviewedOn}', '${files[i].PreparedBy}', '${files[i].Revisable}', '${files[i].Size}', '${files[i].CreatedBy}', '${files[i].Dossier2}', '${files[i].UpLoadedOn}', '${files[i].FileName}', '${files[i].CreatedOn}', '${files[i].Dossier1}', '${files[i].ID}', '${files[i].UpdatedOn}', '${files[i].UpdatedBy}', '${files[i].Commentaire}', '${files[i].Dossier3}', '${files[i].ServerPath}', '${files[i].ReviewedBy}', '${files[i].Extension}', '${files[i].Reviewed}', '${files[i].Locked}', '${files[i].UpLoadedBy}');`)
              .then(() => {
                dispatch(removeNewDoc(files[i].ID))
                dispatch(addDoc(omit(files[i], ['remoteDir', 'isNew', 'filePath'])))
                dispatch(removeFromEdit(files[i].ID))
              })
          } else {
            MSSQL_Out.executeUpdate(`INSERT INTO ${Tables.t_docs} 
            (LocalPath, Prepared, PreparedOn, PageNumber, ReviewedOn, PreparedBy, Revisable, Size, CreatedBy, Dossier2, UpLoadedOn, FileName, CreatedOn, Dossier1, ID, UpdatedOn, UpdatedBy, Commentaire, Dossier3, ServerPath, ReviewedBy, Extension, Reviewed, Locked, UpLoadedBy) 
            VALUES ('${files[i].LocalPath}', '${files[i].Prepared}', '${files[i].PreparedOn}', '${files[i].PageNumber}', '${files[i].ReviewedOn}', '${files[i].PreparedBy}', '${files[i].Revisable}', '${files[i].Size}', '${files[i].CreatedBy}', '${files[i].Dossier2}', '${files[i].UpLoadedOn}', '${files[i].FileName}', '${files[i].CreatedOn}', '${files[i].Dossier1}', '${files[i].ID}', '${files[i].UpdatedOn}', '${files[i].UpdatedBy}', '${files[i].Commentaire}', '${files[i].Dossier3}', '${files[i].ServerPath}', '${files[i].ReviewedBy}', '${files[i].Extension}', '${files[i].Reviewed}', '${files[i].Locked}', '${files[i].UpLoadedBy}');`)
              .then(() => {
                dispatch(removeNewDoc(files[i].ID))
                dispatch(addDoc(omit(files[i], ['remoteDir', 'isNew', 'filePath'])))
                dispatch(removeFromEdit(files[i].ID))
              })
          }
          
        } else {
          if (connectedHome) {
            MSSQL_Home.executeUpdate(`UPDATE ${Tables.t_docs} SET UpLoadedOn='${files[i].UpLoadedOn}', UpdatedOn='${files[i].UpdatedOn}', UpdatedBy='${files[i].UpdatedBy}', UpLoadedBy='${files[i].UpLoadedBy}', Prepared='${files[i].Prepared}', PreparedOn='${files[i].PreparedOn}', PreparedBy='${files[i].PreparedBy}' WHERE ID='${files[i].ID}'`)
              .then(() => dispatch(removeFromEdit(files[i].ID)))
          } else {
            MSSQL_Out.executeUpdate(`UPDATE ${Tables.t_docs} SET UpLoadedOn='${files[i].UpLoadedOn}', UpdatedOn='${files[i].UpdatedOn}', UpdatedBy='${files[i].UpdatedBy}', UpLoadedBy='${files[i].UpLoadedBy}', Prepared='${files[i].Prepared}', PreparedOn='${files[i].PreparedOn}', PreparedBy='${files[i].PreparedBy}' WHERE ID='${files[i].ID}'`)
              .then(() => dispatch(removeFromEdit(files[i].ID)))
          }
        }
      } catch (e) {
        Sentry.captureException(e, { func: 'uploadMultipleFiles', doc: 'userActions' })
        dispatch(cancelUploadingFile(files[i].ID))
      }
    }
  })
  .catch((e) => {
    Sentry.captureException(e, { func: 'uploadMultipleFiles', doc: 'userActions' })
    for (let i = 0; i < files.length; i++) {
      dispatch(cancelUploadingFile(files[i].ID))
    }
  })

