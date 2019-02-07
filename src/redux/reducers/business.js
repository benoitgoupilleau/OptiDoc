import {
  SET_DOCS,
  SET_MODELES,
  SET_BUSINESS,
  UPDATE_PREPARE,
  ADD_DOC,
  ADD_NEW_DOC,
  REMOVED_NEW_DOC
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
    case ADD_DOC: 
      return {
        ...state,
        docs: [...state.docs, action.doc],
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
    case ADD_NEW_DOC: {
      const newDocsUpd = [...state.newDocs, action.doc];
      return {
        ...state,
        newDocs: newDocsUpd
      }
    }
    case REMOVED_NEW_DOC: {
      const currentNewDoc = [...state.newDocs];
      const indexToRemove = currentNewDoc.findIndex(el => el.ID === action.id)
      return {
        ...state,
        newDocs: [...currentNewDoc.slice(0, indexToRemove), ...currentNewDoc.slice(indexToRemove + 1)]
      }
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