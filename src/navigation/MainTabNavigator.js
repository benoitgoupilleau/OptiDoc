import React from 'react';

import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarLabel from '../components/TabBarLabel'
import TabBarIcon from '../components/TabBarIcon';

import HomeScreen from '../screens/HomeScreen';
import AddFileScreen from '../screens/AddFileScreen';
import BusinessScreen from '../screens/BusinessScreen';
import DocsScreen from '../screens/DocsScreen';
import PdfScreen from '../screens/PdfScreen';

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


const BusinessStack = createStackNavigator({
  Business: BusinessScreen,
  Docs: DocsScreen,
  Pdf: PdfScreen,
  Add: AddFileScreen
});

BusinessStack.navigationOptions = {
  tabBarLabel: ({ focused }) => (
    <TabBarLabel
      focused={focused}
      title="Mes Affaires"
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
}, {
  tabBarOptions: {
    style: {
      height: 60,
    }
  }
});
