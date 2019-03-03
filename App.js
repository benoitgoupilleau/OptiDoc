import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AppNavigator from './src/navigation/AppNavigator'

import { store, persistor } from './src/redux/store/store';

import { setupSentry } from './src/services/sentry';

setupSentry();

const App = () => (
  <Provider store={store} >
    <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
      <AppNavigator />
    </PersistGate>
  </Provider>
);

export default App;
