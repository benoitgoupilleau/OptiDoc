import React from "react";
import PropTypes from 'prop-types';
import { Button, AsyncStorage } from "react-native";

class Logout extends React.Component {

  signOutAsync = async () => {
    await AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
        <Button title="Déconnexion" onPress={this.signOutAsync} />
    );
  }
}

Logout.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default Logout;