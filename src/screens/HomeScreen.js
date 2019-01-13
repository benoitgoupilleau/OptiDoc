import React from "react";
import { View, Text, Button, AsyncStorage} from "react-native";

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home'
  };

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

export default HomeScreen;