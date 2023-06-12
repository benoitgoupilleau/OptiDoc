import React from 'react';

import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarLabel from '../components/TabBarLabel';
import TabBarIcon from '../components/TabBarIcon';

import HomeScreen from '../screens/HomeScreen';
import AddFileScreen from '../screens/AddFileScreen';
import AddPictureScreen from '../screens/AddPictureScreen';
import BusinessScreen from '../screens/BusinessScreen';
import DocsScreen from '../screens/DocsScreen';
import PdfScreen from '../screens/PdfScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  // eslint-disable-next-line react/prop-types
  tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Actualités" />,
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-newspaper-outline" />,
};

const BusinessStack = createStackNavigator({
  Business: BusinessScreen,
  Docs: DocsScreen,
  Pdf: PdfScreen,
  AddDoc: AddFileScreen,
  AddPic: AddPictureScreen,
});

BusinessStack.navigationOptions = {
  // eslint-disable-next-line react/prop-types
  tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Mes Affaires" />,
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-folder-open" />,
};

const SysDocStack = createStackNavigator({
  Docs: DocsScreen,
  Pdf: PdfScreen,
  AddDoc: AddFileScreen,
  AddPic: AddPictureScreen,
});

SysDocStack.navigationOptions = {
  // eslint-disable-next-line react/prop-types
  tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title="Système Documentaire" />,
  // eslint-disable-next-line react/prop-types
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-file-tray-full" />,
};

export default createBottomTabNavigator(
  {
    HomeStack,
    SysDocStack,
    BusinessStack,
  },
  {
    tabBarOptions: {
      style: {
        height: 60,
      },
    },
  }
);
