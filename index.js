import { AppRegistry } from 'react-native';
import App from './App'
import { name as appName } from './app.json';

import './src/services/ftp';
import './src/services/mssql';

AppRegistry.registerComponent(appName, () => App);
