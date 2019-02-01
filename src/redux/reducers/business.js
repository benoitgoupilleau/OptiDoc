import {
  SET_DOCS,
  SET_MODELES,
  LOGOUT,
  UPDATE_PREPARE
} from '../actions/types';

const defaultState = {
  docs: [],
  modeles: [],
  newDocs: []
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
    case UPDATE_PREPARE: {
      const currentDoc = [...state.docs];
      const indexToUpdate = currentDoc.findIndex(el => el.ID === action.fileId);
      const newDoc = { ...currentDoc[indexToUpdate], Prepared: action.Prepared, PreparedOn: action.PreparedOn}
      return {
        ...state,
        docs: [...currentDoc.slice(0, indexToUpdate), newDoc, ...currentDoc.slice(indexToUpdate+1)]
      }
    }
    default:
      return state;
  }
};