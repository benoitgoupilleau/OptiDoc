import omit from 'lodash.omit';
import { REHYDRATE } from 'redux-persist';
import { JWT_SECRET } from 'react-native-dotenv';
import jwt from 'react-native-pure-jwt';
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
  REMOVE_EDIT_PREPARE,
  CANCEL_UPLOAD
} from '../actions/types';

const defaultState = {
  id: undefined,
  id_employe: undefined,
  bearerToken: '',
  userName: '',
  name: '',
  downloadedBusiness: [],
  loadingBusiness: [],
  nbDocBusiness: 0,
  totalDocBusiness: 0,
  editedDocs: [],
  uploadingDocs: [],
  locked: false,
  modeleDownloaded: 'no',
  nbDownloaded: 0,
  totalModeles: 0
}

const checkToken = async (token) => {
  const verify = jwt.verify(token, JWT_SECRET, { alg: 'hs256' })
  const now = new Date().getTime();
  const isStillValid = verify.exp && verify.exp > now;
  return isStillValid;
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      let unValidToken = false;
      let omitToken = {}
      let omitLoading = {}
      if (action.payload && action.payload.user && action.payload.user.bearerToken) {
        unValidToken = !checkToken(action.payload.user.bearerToken);
        omitToken = { ...omit(action.payload.user, 'bearerToken') }
        omitLoading = { ...omit(action.payload.user, 'loadingBusiness') }
      }
      const modeleDownloaded = action.payload && action.payload.user && (action.payload.user.modeleDownloaded === 'yes' || action.payload.user.modeleDownloaded === 'no') ? action.payload.user.modeleDownloaded : 'no';
      if (unValidToken) {
        return {
          ...state,
          ...omitToken,
          modeleDownloaded
        }
      }
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
        id_employe: action.id_employe,
        name: action.name,
      }
    case LOGOUT:
      return {
        ...state,
        ...omit(defaultState, ['userName', 'downloadedBusiness'])
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
      if (!!fileEdit.editPath) {
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
      const indexToRemove = currentFiles.findIndex(el => el === action.fileId);
      return {
        ...state,
        uploadingDocs: [...currentFiles.slice(0, indexToRemove), ...currentFiles.slice(indexToRemove + 1)]
      }
    }
    case REMOVE_EDIT_FILE: {
      const currentFiles = [...state.editedDocs];
      const indexToRemove = currentFiles.findIndex(el => el.ID === action.id);
      const newFiles = [...currentFiles.slice(0, indexToRemove), ...currentFiles.slice(indexToRemove + 1)]
      const currentUpload = [...state.uploadingDocs];
      const indexUpload = currentUpload.findIndex(el => el === action.id);
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