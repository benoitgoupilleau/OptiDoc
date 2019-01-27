import {
  SET_DOCS,
  SET_DOE,
  SET_DOE_CHAP,
  SET_DOE_DOC,
  SET_MODELES,
  SET_PROTO_DMOS,
  SET_QMOS,
  SET_QUALIF,
  SET_SOUD,
  LOGOUT
} from '../actions/types';

const defaultState = {
  docs: [],
  doe: [],
  doeChapter: [],
  doeDoc:[],
  modeles: [],
  protoDMOS: [],
  qmos: [],
  qualif: [],
  soud: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_DOCS:
      return {
        ...state,
        docs: action.docs,
      }
    case SET_DOE:
      return {
        ...state,
        doe: action.doe,
      }
    case SET_DOE_CHAP:
      return {
        ...state,
        doeChapter: action.doeChapter,
      }
    case SET_DOE_DOC:
      return {
        ...state,
        doeDoc: action.doeDoc,
      }
    case SET_MODELES:
      return {
        ...state,
        modeles: action.modeles,
      }
    case SET_PROTO_DMOS:
      return {
        ...state,
        protoDMOS: action.protoDMOS,
      }
    case SET_QMOS:
      return {
        ...state,
        qmos: action.qmos,
      }
    case SET_QUALIF:
      return {
        ...state,
        qualif: action.qualif,
      }
    case SET_SOUD:
      return {
        ...state,
        soud: action.soud,
      }
    case LOGOUT:
      return {
        ...defaultState
      }
    default:
      return state;
  }
};