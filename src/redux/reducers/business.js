import {
  SET_DOCS,
  SET_MODELES,
  LOGOUT
} from '../actions/types';

const defaultState = {
  docs: [],
  modeles: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_DOCS:
      return {
        ...state,
        docs: action.docs,
      }
    case SET_MODELES:
      return {
        ...state,
        modeles: action.modeles,
      }
    case LOGOUT:
      return {
        ...defaultState
      }
    default:
      return state;
  }
};