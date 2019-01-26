import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { ENV, PERSIST_KEY } from 'react-native-dotenv';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createEncryptor from 'redux-persist-transform-encrypt';

import newsReducer from '../reducers/news';
import offlineReducer from '../reducers/offline'
import teamReducer from '../reducers/team';
import userReducer from '../reducers/user';

const composeEnhancers = ENV && ENV === 'dev' ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;

const encryptor = createEncryptor({
  secretKey: PERSIST_KEY,
  onError: function (error) {
    console.log(error)
  }
})

const persistConfig = {
  key: 'root',
  transforms: [encryptor],
  storage: storage,
  stateReconciler: autoMergeLevel2
};

const rootReducer = combineReducers({
  news: newsReducer,
  network: offlineReducer,
  teams: teamReducer,
  user: userReducer
});

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer, composeEnhancers(applyMiddleware(thunk)));

export const persistor = persistStore(store);




