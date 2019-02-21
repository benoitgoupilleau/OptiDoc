import {
  SET_NEWS,
  REFRESH_NEWS
} from '../actions/types';

const defaultState = {
  newsList: [],
  loaded: false,
  refreshing: false
}

export default (state = defaultState, action) => {
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
    default:
      return state;
  }
};