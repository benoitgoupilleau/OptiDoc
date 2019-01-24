import React from "react";
import { Text } from "react-native";

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

class BusinessScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title='hello' />,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }
  
  render() { 
    return (
      <Main>
        <Text>Business Screen</Text>
      </Main>
    );
  }
}

export default BusinessScreen;