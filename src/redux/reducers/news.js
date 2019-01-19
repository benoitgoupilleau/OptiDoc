import {
  LOGOUT
} from '../actions/types';

const defaultNewsState = {
  newsList: [],
}

export default (state = defaultNewsState, action) => {
  switch (action.type) {
    case LOGOUT:
      return { ...defaultNewsState };
    default:
      return state;
  }
};