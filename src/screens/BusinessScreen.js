import React from "react";
import { View, Text } from "react-native";

import Logout from '../components/Logout';
import LogoHeader from '../components/LogoHeader'

class BusinessScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoHeader />,
      headerRight: <Logout navigation={navigation} />
    };
  }
  
  render() { 
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Business Screen</Text>
      </View>
    );
  }
}

export default BusinessScreen;