import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components'
import { View, Text, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';
import { withNavigation } from 'react-navigation';

import { login } from '../redux/actions/user'

const emailRegex = new RegExp(/^[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,6}?\.[a-zA-Z]{2,6}$/);

const Wrapper = styled(View)`
  max-width: 400px;
  width: 80%;
  min-width: 200px;
`;

const Title = styled(Text)`
  color: blue;
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
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
  }

  componentDidMount(){
    const email = this.props.email;
    this.setState({ email })
  }

  signInAsync = async () => {
    if (!emailRegex.test(this.state.email)) {
      return ToastAndroid.showWithGravity('Adresse email invalide', ToastAndroid.SHORT, ToastAndroid.CENTER)
    } else if (this.state.password === '') {
      return ToastAndroid.showWithGravity('Merci de saisir votre mot de passe', ToastAndroid.SHORT, ToastAndroid.CENTER)
    } else {
      this.props.login(this.state.email, 'EQU_20181102195830422', 'abc')
      this.props.navigation.navigate('App');
    }
  };

  render() {
    return (
      <Wrapper>
        <Title>OptiDoc</Title>
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
  navigation: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  email: state.user.email
})

export default withNavigation(connect(mapStateToProps, { login })(Signin));
