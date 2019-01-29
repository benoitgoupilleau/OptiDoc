import omit from 'lodash.omit';
import { REHYDRATE } from 'redux-persist';
import { JWT_SECRET } from 'react-native-dotenv';
import jwt from 'react-native-pure-jwt';
import {
  LOGIN,
  LOGOUT,
  BUSINESS_DOWNLOADED
} from '../actions/types';

const defaultState = {
  id: undefined,
  bearerToken: '',
  email: '',
  lastName: '',
  firstName: '',
  downloadedBusiness: [],
  editedDocs: [],
  locked: false
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
        ...action.payload.user
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
    case BUSINESS_DOWNLOADED: {
      const currentBusiness = [...state.downloadedBusiness, action.id];
      return {
        ...state,
        downloadedBusiness: currentBusiness
      }
    } 
    default:
      return state;
  }
};