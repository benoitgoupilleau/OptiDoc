import omit from 'lodash.omit';
import {
  LOGIN,
  LOGOUT,
  BUSINESS_DOWNLOADED
} from '../actions/types';

const defaultState = {
  id: undefined,
  bearerToken: '',
  email: '',
  downloadedBusiness: [],
  editedDocs: [],
  locked: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        email: action.email,
        bearerToken: action.bearerToken,
        id: action.id
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