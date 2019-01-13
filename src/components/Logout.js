import React from "react";
import PropTypes from 'prop-types';
import { Button, AsyncStorage } from "react-native";

class Logout extends React.Component {

  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
        <Button title="Logout" onPress={this.signOutAsync} />
    );
  }
}

Logout.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default Logout;