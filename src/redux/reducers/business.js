import {
  SET_DOCS,
  SET_MODELES,
  SET_BUSINESS,
  UPDATE_PREPARE
} from '../actions/types';

const defaultState = {
  docs: [],
  modeles: [],
  newDocs: [],
  business: []
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
    case SET_BUSINESS:
      return {
        ...state,
        business: action.business,
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