import React from "react";
import PropTypes from 'prop-types';
import { View, Text, Button, AsyncStorage} from "react-native";

import Logout from '../components/Logout';
import LogoHeader from '../components/LogoHeader'

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <LogoHeader />,
      headerRight: <Logout navigation={navigation} />
    };
  }


  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Button title="Actually, sign me out :)" onPress={this.signOutAsync} />
      </View>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default HomeScreen;