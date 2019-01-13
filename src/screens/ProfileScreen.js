import React from "react";
import { View, Text } from "react-native";

import TabBarIcon from '../components/TabBarIcon';

class ProfileScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Profile',
    title: 'Settings',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name="md-settings"
      />
    ),
  }
  
  render() { 
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Profile Screen</Text>
      </View>
    );
  }
}

export default ProfileScreen;