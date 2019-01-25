import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { ENV } from 'react-native-dotenv';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import newsReducer from '../reducers/news';
import offlineReducer from '../reducers/offline'

const composeEnhancers = ENV && ENV === 'dev' ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2
};

const rootReducer = combineReducers({
  news: newsReducer,
  network: offlineReducer
});

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, composeEnhancers(applyMiddleware(thunk)));

export const persistor = persistStore(store);




