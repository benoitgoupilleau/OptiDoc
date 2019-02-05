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
  UPLOADING_FILE
} from '../actions/types';

const defaultState = {
  id: undefined,
  id_employe: undefined,
  bearerToken: '',
  userName: '',
  name: '',
  downloadedBusiness: [],
  loadingBusiness: [],
  editedDocs: [],
  uploadingDocs: [],
  locked: false,
  modeleDownloaded: 'no',
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
      if (unValidToken) {
        return {
          ...state,
          ...omitToken
        }
      }
      return {
        ...state,
        ...omitLoading
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
        ...omit(defaultState, 'userName')
      }
    case DOWNLOADING_BUSINESS: {
      const currentBusiness = [...state.loadingBusiness, action.id];
      return {
        ...state,
        loadingBusiness: currentBusiness
      }
    }
    case BUSINESS_DOWNLOADED: {
      const currentBusiness = [...state.downloadedBusiness, action.id];
      const downloading = [...state.loadingBusiness];
      const indexToRemove = downloading.findIndex(el => el === action.id);
      return {
        ...state,
        downloadedBusiness: currentBusiness,
        loadingBusiness: [...downloading.slice(0, indexToRemove), ...downloading.slice(indexToRemove + 1)]
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
      if (!currentFiles.includes(action.fileId)) currentFiles.push(action.fileId)
      return {
        ...state,
        editedDocs: currentFiles,
        locked: true
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
    case REMOVE_EDIT_FILE: {
      const currentFiles = [...state.editedDocs];
      const indexToRemove = currentFiles.findIndex(el => el === action.id);
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
        modeleDownloaded: 'in progress'
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