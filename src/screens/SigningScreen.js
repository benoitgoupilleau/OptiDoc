import React from "react";
import { View, Button, AsyncStorage } from "react-native";

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button title="Sign in!" onPress={this.signInAsync} />
      </View>
    );
  }
}

export default SignInScreen;
