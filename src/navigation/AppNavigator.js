import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import SignInScreen from '../screens/SigningScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: MainTabNavigator,
      Auth: SignInScreen
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
