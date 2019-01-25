import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, AsyncStorage } from 'react-native';
import Main from '../components/Main';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <Main>
          <ActivityIndicator />
      </Main>
    );
  }
}

AuthLoadingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default AuthLoadingScreen;
