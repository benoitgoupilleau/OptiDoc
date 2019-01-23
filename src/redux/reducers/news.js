import {
  LOGOUT,
  SET_NEWS,
} from '../actions/types';

const defaultNewsState = {
  newsList: [],
}

export default (state = defaultNewsState, action) => {
  switch (action.type) {
    case SET_NEWS: 
      return {
        ...state,
        newsList: action.news
      }
    case LOGOUT:
      return { ...defaultNewsState };
    default:
      return state;
  }
};