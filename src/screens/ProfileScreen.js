import React from "react";
import { View, Text } from "react-native";

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'

class ProfileScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle />,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
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