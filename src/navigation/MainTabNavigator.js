import React from 'react';

import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarLabel from '../components/TabBarLabel'
import TabBarIcon from '../components/TabBarIcon';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BusinessScreen from '../screens/BusinessScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: ({ focused }) => (
    <TabBarLabel
      focused={focused}
      title="Actualités"
    />
  ),
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
  tabBarLabel: ({ focused }) => (
    <TabBarLabel
      focused={focused}
      title="Paramètres"
    />
  ),
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
  tabBarLabel: ({ focused }) => (
    <TabBarLabel
      focused={focused}
      title="Affaires"
    />
  ),
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
  // ProfileStack
}, {
  tabBarOptions: {
    style: {
      height: 70,
    }
  }
});
