import React from 'react';
import { Text } from 'react-native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

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
      <Main>
        <Text>Profile Screen</Text>
      </Main>
    );
  }
}

export default ProfileScreen;