import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Button, AsyncStorage } from "react-native";
import { withNavigation } from 'react-navigation';

const Wrapper = styled(View)`
  margin: 0 20px;
`;

class Logout extends React.Component {

  signOutAsync = async () => {
    await AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <Wrapper>
        <Button title="Déconnexion" onPress={this.signOutAsync} />
      </Wrapper>
    );
  }
}

Logout.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default withNavigation(Logout);