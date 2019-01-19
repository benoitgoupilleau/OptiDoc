import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import newsReducer from '../reducers/news';


const rootReducer = combineReducers({
  news: newsReducer,
});


export const store = createStore(rootReducer, compose(applyMiddleware(thunk)));





