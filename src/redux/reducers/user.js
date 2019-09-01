import omit from 'lodash.omit';
import { REHYDRATE } from 'redux-persist';
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
  REMOVE_EDIT_PREPARE,
  CANCEL_UPLOAD,
  CANCEL_DOWNLOAD_FILE,
  FILE_DOWNLOADED,
  DOWNLOADING_FILE,
  SET_DOCS_TO_DOWNLOAD,
  MULTI_UPLOAD
} from '../actions/types';

const defaultState = {
  id: undefined,
  id_employe: undefined,
  bearerToken: '',
  userName: '',
  name: '',
  downloadedBusiness: [],
  loadingBusiness: [],
  loadingFiles: [],
  fileToDownload: [],
  nbDocBusiness: 0,
  totalDocBusiness: 0,
  editedDocs: [],
  uploadingDocs: [],
  multipleUploadDocs: [],
  locked: false,
  modeleDownloaded: 'no',
  nbDownloaded: 0,
  totalModeles: 0,
  sessionExpired: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      let omitLoading = {}
      if (action.payload && action.payload.user) {
        omitLoading = { ...omit(action.payload.user, ['loadingBusiness', 'modeleDownloaded']) }
      }
      const modeleDownloaded = action.payload && action.payload.user && (action.payload.user.modeleDownloaded === 'yes' || action.payload.user.modeleDownloaded === 'no') ? action.payload.user.modeleDownloaded : 'no';
      return {
        ...state,
        ...omitLoading,
        modeleDownloaded
      }
    }
    case LOGIN:
      return {
        ...state,
        userName: action.userName,
        bearerToken: action.bearerToken,
        id: action.id,
        name: action.name,
        sessionExpired: false
      }
    case LOGOUT:
      return {
        ...state,
        ...omit(defaultState, ['userName', 'downloadedBusiness', 'editedDocs'])
      }
    case SESSION_EXPIRED:
      return {
        ...state,
        sessionExpired: true,
        locked: state.editedDocs.length > 0
      }
    case DOWNLOADING_BUSINESS: {
      const currentBusiness = state.loadingBusiness.includes(action.id) ? [...state.loadingBusiness] : [...state.loadingBusiness, action.id];
      return {
        ...state,
        loadingBusiness: currentBusiness,
        nbDocBusiness: action.nb,
        totalDocBusiness: action.total
      }
    }
    case BUSINESS_DOWNLOADED: {
      const currentBusiness = state.downloadedBusiness.includes(action.id) ? [...state.downloadedBusiness] : [...state.downloadedBusiness, action.id];
      const downloading = [...state.loadingBusiness];
      const indexToRemove = downloading.findIndex(el => el === action.id);
      return {
        ...state,
        downloadedBusiness: currentBusiness,
        loadingBusiness: [...downloading.slice(0, indexToRemove), ...downloading.slice(indexToRemove + 1)],
        nbDocBusiness: 0,
        totalDocBusiness: 0
      }
    }
    case CANCEL_DOWNLOAD: {
      const downloading = [...state.loadingBusiness];
      const indexToRemove = downloading.findIndex(el => el === action.id);
      return {
        ...state,
        loadingBusiness: [...downloading.slice(0, indexToRemove), ...downloading.slice(indexToRemove + 1)]
      }
    }
    case MULTI_UPLOAD: {
      const newMultipleUploadDocs = [...state.multipleUploadDocs, ...action.uploads]
      return {
        ...state,
        multipleUploadDocs: newMultipleUploadDocs,
      }
    }
    case DOWNLOADING_FILE: {
      const currentFiles = state.loadingFiles.includes(action.id) ? [...state.loadingFiles] : [...state.loadingFiles, action.id];
      return {
        ...state,
        loadingFiles: currentFiles
      }
    }
    case CANCEL_DOWNLOAD_FILE: {
      const downloading = [...state.loadingFiles];
      const indexToRemove = downloading.findIndex(el => el === action.id);
      return {
        ...state,
        loadingFiles: [...downloading.slice(0, indexToRemove), ...downloading.slice(indexToRemove + 1)]
      }
    }
    case FILE_DOWNLOADED: {
      const downloading = [...state.loadingFiles];
      const indexToRemove = downloading.findIndex(el => el === action.id);
      const currentfileToDownload = [...state.fileToDownload];
      const indexToDownload = currentfileToDownload.findIndex(el => el === action.id);
      const leftToDownload = indexToDownload > -1 ? [...currentfileToDownload.slice(0, indexToDownload), ...currentfileToDownload.slice(indexToDownload +1)]
       : currentfileToDownload
      return {
        ...state,
        loadingFiles: [...downloading.slice(0, indexToRemove), ...downloading.slice(indexToRemove + 1)],
        fileToDownload: leftToDownload
      }
    }
    case SET_DOCS_TO_DOWNLOAD: {
      const currentFiles = [...state.fileToDownload]
      return {
        ...state,
        fileToDownload: [...currentFiles, ...action.fileToDownload]
      }
    }
    case EDIT_FILE: {
      const currentFiles = [...state.editedDocs];
      const indexToUpdate = currentFiles.findIndex(c => c.ID === action.file.ID)
      if (indexToUpdate === -1) {
        currentFiles.push(action.file)
        return {
          ...state,
          editedDocs: currentFiles,
          locked: true
        }
      } else {
        const newEditFile = { ...currentFiles[indexToUpdate], ...action.file}
        return {
          ...state,
          editedDocs: [...currentFiles.slice(0, indexToUpdate), newEditFile, ...currentFiles.slice(indexToUpdate+1)],
          locked: true
        }
      }
    }
    case REMOVE_EDIT_PREPARE: {
      const currentFiles = [...state.editedDocs];
      const indexToUpdate = currentFiles.findIndex(c => c.ID === action.id)
      const fileEdit = currentFiles[indexToUpdate];
      if (fileEdit.editPath) {
        delete fileEdit.prepared;
        return {
          ...state,
          editedDocs: [...currentFiles.slice(0, indexToUpdate), fileEdit, ...currentFiles.slice(indexToUpdate+1)]
        }
      } else {
        const newEditDocs = [...currentFiles.slice(0, indexToUpdate), ...currentFiles.slice(indexToUpdate+1)]
        return {
          ...state,
          editedDocs: newEditDocs,
          locked: newEditDocs.length > 0
        }
      }

    }
    case UPLOADING_FILE: {
      const currentFiles = [...state.uploadingDocs];
      if (!currentFiles.includes(action.fileId)) currentFiles.push(action.fileId)
      return {
        ...state,
        uploadingDocs: currentFiles
      }
    }
    case CANCEL_UPLOAD: {
      const currentFiles = [...state.uploadingDocs];
      const multiDocs = [...state.multipleUploadDocs]
      const indexMulti = multiDocs.findIndex(el => el.fileId === action.fileId)
      const indexToRemove = currentFiles.findIndex(el => el === action.fileId);
      if (indexMulti > -1) {
        return {
          ...state,
          multipleUploadDocs: [...multiDocs.slice(0, indexMulti), ...multiDocs.slice(indexMulti +1)],
          uploadingDocs: [...currentFiles.slice(0, indexToRemove), ...currentFiles.slice(indexToRemove + 1)]
        }
      }
      return {
        ...state,
        uploadingDocs: [...currentFiles.slice(0, indexToRemove), ...currentFiles.slice(indexToRemove + 1)]
      }
    }
    case REMOVE_EDIT_FILE: {
      const currentFiles = [...state.editedDocs];
      const indexToRemove = currentFiles.findIndex(el => el.ID === action.id);
      const newFiles = [...currentFiles.slice(0, indexToRemove), ...currentFiles.slice(indexToRemove + 1)]
      const multiDocs = [...state.multipleUploadDocs]
      const indexMulti = multiDocs.findIndex(el => el.fileId === action.id)
      const currentUpload = [...state.uploadingDocs];
      const indexUpload = currentUpload.findIndex(el => el === action.id);
      if (indexMulti > -1) {
        return {
          ...state,
          editedDocs: newFiles,
          multipleUploadDocs: [...multiDocs.slice(0, indexMulti), ...multiDocs.slice(indexMulti + 1)],
          locked: (newFiles.length > 0),
          uploadingDocs: [...currentUpload.slice(0, indexUpload), ...currentUpload.slice(indexUpload + 1)]
        }
      }
      return {
        ...state,
        editedDocs: newFiles,
        locked: (newFiles.length > 0),
        uploadingDocs: [...currentUpload.slice(0, indexUpload), ...currentUpload.slice(indexUpload + 1)]
      }
    }
    case DOWNLOADING_MODELE:
      return {
        ...state,
        modeleDownloaded: 'in progress',
        nbDownloaded: action.nb,
        totalModeles: action.total
      }
    case CANCEL_DOWNLOAD_MODELE:
      return {
        ...state,
        modeleDownloaded: 'no'
      }
    case MODELE_DOWNLOADED:
      return {
        ...state,
        modeleDownloaded: 'yes'
      }
    default:
      return state;
  }
};