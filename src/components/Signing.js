import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components'
import { View, Text, AsyncStorage, TextInput, TouchableOpacity, ToastAndroid } from "react-native";
import { withNavigation } from 'react-navigation';

const emailRegex = new RegExp(/^[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,6}?\.[a-zA-Z]{2,6}$/);

const Wrapper = styled(View)`
  max-width: 400px;
  width: 80%;
  min-width: 200px;
`;

const StyledInput = styled(TextInput)`
  border-color: gray;
  border-width: 1px;
  font-size: 20px;
  height: 60px;
  margin-bottom: 20px;
`;

const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: #DDDDDD;
  height: 60px;
  text-align: center;
  padding: 10px;
`;


class Signin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
    this.getLastUser()
  }

  getLastUser = async () => {
  const email = await AsyncStorage.getItem('lastUserEmail');
    this.setState({ email })
}

  signInAsync = async () => {
    if (!emailRegex.test(this.state.email)) {
      return ToastAndroid.showWithGravity('Adresse email invalide', ToastAndroid.SHORT, ToastAndroid.CENTER)
    } else if (this.state.password === '') {
      return ToastAndroid.showWithGravity('Merci de saisir votre mot de passe', ToastAndroid.SHORT, ToastAndroid.CENTER)
    } else {
      await AsyncStorage.setItem('lastUserEmail', this.state.email);
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('App');
    }
  };

  render() {
    return (
      <Wrapper>
        <StyledInput 
          allowFontScaling
          keyboardType="email-address"
          onChangeText={(email) => this.setState({ email })}
          placeholder="Email"
          value={this.state.email}
        />
        <StyledInput
          allowFontScaling
          onChangeText={(password) => this.setState({ password })}
          placeholder="Mot de passe"
          secureTextEntry
          value={this.state.password}
        />
        <StyledButton onPress={this.signInAsync}>
          <Text style={{ fontSize: 20 }}>Connexion</Text>
        </StyledButton>
      </Wrapper>
    );
  }
}

Signin.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default withNavigation(Signin);
