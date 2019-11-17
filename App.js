import React from 'react';
import { ActivityIndicator } from 'react-native';
import { ENV } from 'react-native-dotenv';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AppNavigator from './src/navigation/AppNavigator';
import NavigationService from './src/services/navigationService';

import { store, persistor } from './src/redux/store/store';

import { setupSentry } from './src/services/sentry';
import { setRootDir } from './src/services/rootDir';

import * as Sentry from '@sentry/react-native';

Sentry.init({ 
  dsn: 'https://fbc2d25a7f044e1980699785ab02c387@sentry.io/1405393', 
});


if (ENV !== 'dev') setupSentry();
setRootDir();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
      <AppNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </PersistGate>
  </Provider>
);

export default App;
