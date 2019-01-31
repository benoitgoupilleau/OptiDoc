import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components'
import { JWT_SECRET, JWT_EXPIRE, ENV } from 'react-native-dotenv';
import jwt from 'react-native-pure-jwt'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';

import Logout from './Logout';

import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

import { login } from '../redux/actions/user'

const emailRegex = new RegExp(/^[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,6}?\.[a-zA-Z]{2,6}$/);

const Wrapper = styled(View)`
  max-width: 400px;
  width: 80%;
  min-width: 200px;
`;

const Title = styled(Text)`
  color: ${Colors.mainColor};
  font-size: ${Layout.font.xlarge};
  margin-bottom: ${Layout.space.xlarge};
  text-align: center;
`;

const StyledInput = styled(TextInput)`
  border-color: gray;
  border-width: 1px;
  font-size: ${Layout.font.medium};
  height: 60px;
  margin-bottom: ${Layout.space.large};
`;

const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${Colors.mainColor};
  height: 60px;
  text-align: center;
  padding: ${Layout.space.medium};
`;

const Message = styled(Text)`
  text-align: center;
  font-style: italic;
  padding-bottom: ${Layout.space.small};
`;

const StyledText = styled(Text)`
  color: white;
  font-size: ${Layout.font.medium};
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
    if (!this.props.teamLoaded) {
      Alert.alert('Connexion Impossible', 'Merci de réessayer plus tard', [{ text: 'Ok' }]);
    } else {
      if (!emailRegex.test(this.state.email)) {
        Alert.alert('Identifiants incorrects', 'Adresse email invalide', [{ text: 'Ok' }]);
      } else if (this.state.password === '') {
        Alert.alert('Identifiants incorrects', 'Merci de saisir votre mot de passe', [{ text: 'Ok' }]);
      } else {

        const users = this.props.teams.filter(t => (t.Statut === 'Actif' && t.Mail === this.state.email && ((ENV && ENV === 'dev') || t.Mdp === this.state.password)));
        if (users.length > 0) {
          const addTime = parseInt(JWT_EXPIRE, 10);
          const token = await jwt.sign({ iss: users[0].ID, exp: new Date().getTime() + addTime * 1000 }, JWT_SECRET, { alg: 'hs256'});
          this.props.login(this.state.email, users[0], token)
          this.props.navigation.navigate('App');
        } else {
          Alert.alert('Identifiants incorrects', 'Merci de vérifier votre email et mot de passe', [{ text: 'Ok' }]);
        }
      }
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
          editable={!this.props.locked}
          returnKeyType="next"
        />
        <StyledInput
          allowFontScaling
          onChangeText={(password) => this.setState({ password })}
          placeholder="Mot de passe"
          secureTextEntry
          value={this.state.password}
          returnKeyType="done"
        />
        <Message>Mot de passe oublié ? Merci de contacter votre administrateur</Message>
        <StyledButton onPress={this.signInAsync}>
          <StyledText>Connexion</StyledText>
        </StyledButton>
        {this.props.locked && <Logout title="Forcer la déconnexion" />}
      </Wrapper>
    );
  }
}

Signin.propTypes = {
  navigation: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  locked: PropTypes.bool.isRequired,
  teamLoaded: PropTypes.bool.isRequired,
  teams: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  email: state.user.email,
  locked: state.user.locked,
  teams: state.teams.teams,
  teamLoaded: state.teams.teamLoaded
})

export default withNavigation(connect(mapStateToProps, { login })(Signin));
