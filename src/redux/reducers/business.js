import {
  SET_DOCS,
  SET_MODELES,
  SET_BUSINESS,
  UPDATE_PREPARE,
  ADD_DOC,
  ADD_NEW_DOC,
  REMOVED_NEW_DOC,
  SET_ARBO,
  UPDATE_DOC,
} from '../actions/types';

const defaultState = {
  docs: [],
  modeles: [],
  newDocs: [],
  business: [],
  subFolder: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_DOCS: {
      if (action.editedDocs.length > 0) {
        const newDocs = [];
        const currentDocs = [...state.docs];
        for (let i = 0; i< action.docs.length; i++) {
          const indexOfEdited = action.editedDocs.findIndex(el => el.ID === action.docs[i].ID)
          if (indexOfEdited === -1) {
            newDocs.push(action.docs[i])
          } else {
            const indexToKeep = currentDocs.findIndex(el => el.ID === action.docs[i].ID);
            newDocs.push(currentDocs[indexToKeep])
          }
        }
        return {
          ...state,
          docs: newDocs
        }
      }
      return {
        ...state,
        docs: action.docs,
      }
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
    case SET_ARBO:
      return {
        ...state,
        subFolder: action.subFolder,
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
    case UPDATE_DOC: {
      const indexToUpdate = state.newDocs.findIndex(d => d.ID === action.id)
      const docToUpdate = { ...state.newDocs[indexToUpdate], FileName: action.FileName };
      return {
        ...state,
        newDocs: [ ...state.newDocs.slice(0, indexToUpdate), docToUpdate, ...state.newDocs.slice(indexToUpdate + 1)]
      }
    }
    case UPDATE_PREPARE: {
      const currentDoc = [...state.docs];
      const currentNewDoc = [...state.newDocs];
      const indexDocToUpdate = currentDoc.findIndex(el => el.ID === action.fileId);
      const indexNewDocToUpdate = currentNewDoc.findIndex(el => el.ID === action.fileId);
      if (indexNewDocToUpdate > -1) {
        const newDoc = { ...currentNewDoc[indexNewDocToUpdate], Prepared: action.Prepared, PreparedOn: action.PreparedOn, PreparedBy: action.PreparedBy, Revisable: action.Revisable }
        return {
          ...state,
          newDocs: [...currentNewDoc.slice(0, indexNewDocToUpdate), newDoc, ...currentNewDoc.slice(indexNewDocToUpdate+1)]
        }
      } else {
        const newDoc = { ...currentDoc[indexDocToUpdate], Prepared: action.Prepared, PreparedOn: action.PreparedOn, PreparedBy: action.PreparedBy, Revisable: action.Revisable }
        return {
          ...state,
          docs: [...currentDoc.slice(0, indexDocToUpdate), newDoc, ...currentDoc.slice(indexDocToUpdate+1)]
        }
      }
    }
    default:
      return state;
  }
};