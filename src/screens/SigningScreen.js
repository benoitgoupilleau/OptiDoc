import React from "react";
import PropTypes from 'prop-types';
import { View } from "react-native";

import Signin from '../components/Signing';

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Signin navigation={this.props.navigation} />
      </View>
    );
  }
}

SignInScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default SignInScreen;
