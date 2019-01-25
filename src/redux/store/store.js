import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { ENV } from 'react-native-dotenv';
import thunk from 'redux-thunk';

import newsReducer from '../reducers/news';
import offlineReducer from '../reducers/offline'

const composeEnhancers = ENV && ENV === 'dev' ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;


const rootReducer = combineReducers({
  news: newsReducer,
  network: offlineReducer
});


export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));





