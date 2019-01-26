import {
  SET_DOCS,
} from '../actions/types';

const defaultState = {
  docs: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_DOCS:
      return {
        ...state,
        docs: action.docs,
      }
    default:
      return state;
  }
};