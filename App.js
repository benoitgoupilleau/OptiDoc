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
  dsn: 'https://8f17dcd28546422c963645d5457ff051@o132692.ingest.sentry.io/4504762494222336',
  tracesSampleRate: 1.0,
});

if (ENV !== 'dev') setupSentry();
setRootDir();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
      <AppNavigator
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </PersistGate>
  </Provider>
);

export default App;
