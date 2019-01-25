import {
  LOGOUT,
  SET_NEWS,
  REFRESH_NEWS
} from '../actions/types';

const defaultNewsState = {
  newsList: [],
  loaded: false,
  refreshing: false
}

export default (state = defaultNewsState, action) => {
  switch (action.type) {
    case SET_NEWS: 
      return {
        ...state,
        newsList: action.news,
        loaded: true,
        refreshing: false
      }
    case REFRESH_NEWS:
      return {
        ...state,
        refreshing: true
      }
    case LOGOUT:
      return { ...defaultNewsState };
    default:
      return state;
  }
};