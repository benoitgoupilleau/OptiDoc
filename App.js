import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import AppNavigator from './src/navigation/AppNavigator'

import { store, persistor } from './src/redux/store/store';
import { connectDb } from './src/services/mssql';
import { connectFtp } from './src/services/ftp'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.initDb()
  }

  initDb = async () => {
    await connectDb();
    await connectFtp();
  }

  render() {
    return (
      <Provider store={store} >
        <PersistGate loading={<ActivityIndicator />}persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    )
  }
}

export default App;
