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
  MODELE_DOWNLOADED
} from '../actions/types';

const defaultState = {
  id: undefined,
  bearerToken: '',
  email: '',
  lastName: '',
  firstName: '',
  downloadedBusiness: [],
  loadingBusiness: [],
  editedDocs: [],
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
      const unValidToken = (!action.payload || !action.payload.user || !action.payload.user.bearerToken || !checkToken(action.payload.user.bearerToken));
      if (unValidToken) {
        return {
          ...state,
          ...omit(action.payload.user, 'bearerToken')
        }
      }
      return {
        ...state,
        ...omit(action.payload.user, 'loadingBusiness')
      }
    }
    case LOGIN:
      return {
        ...state,
        email: action.email,
        bearerToken: action.bearerToken,
        id: action.id,
        lastName: action.lastName,
        firstName: action.firstName
      }
    case LOGOUT:
      return {
        ...state,
        ...omit(defaultState, 'email')
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
        loadingBusiness: [...downloading.slice(0, indexToRemove), ...downloading.slice(indexToRemove+1)]
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
    case EDIT_FILE:{
      const currentFiles = [...state.editedDocs, action.fileId];
      return {
        ...state,
        editedDocs: currentFiles,
        locked: true
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