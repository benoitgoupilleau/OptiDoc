import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AppNavigator from './src/navigation/AppNavigator'

import { store, persistor } from './src/redux/store/store';

import { Sentry } from 'react-native-sentry';

Sentry.config({
  dns:'https://fbc2d25a7f044e1980699785ab02c387@sentry.io/1405393',
  release: '0.0.3',
  environment: 8
}).install();


const App = () => (
  <Provider store={store} >
    <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
      <AppNavigator />
    </PersistGate>
  </Provider>
);

export default App;
