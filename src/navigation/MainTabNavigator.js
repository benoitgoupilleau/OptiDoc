import React from 'react';

import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BusinessScreen from '../screens/BusinessScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Actualités',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="md-paper"
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Paramètres',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="md-settings"
    />
  ),
};

const BusinessStack = createStackNavigator({
  Business: BusinessScreen,
});

BusinessStack.navigationOptions = {
  tabBarLabel: 'Affaires',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name="md-folder-open"
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
  BusinessStack,
  ProfileStack
}, {
  tabBarOptions: {
    labelStyle: {
      fontSize: 20,
    },
    style: {
      height: 70,
    }
  }
});
