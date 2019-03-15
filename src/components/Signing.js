import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components'
import { JWT_SECRET, JWT_EXPIRE } from 'react-native-dotenv';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SwitchSelector from "react-native-switch-selector";
import jwt from 'react-native-pure-jwt'
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import logo from '../assets/images/logo.png';

import Logout from './Logout';

import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

import { login } from '../redux/actions/user'
import { getUser } from '../redux/actions/team'
import { switchDb } from '../redux/actions/network'


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
  height: 50px;
  margin-bottom: ${Layout.space.large};
`;

const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${Colors.mainColor};
  height: 50px;
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

const encoded = (str) => {
  const encodedChar = []
  for (let i = 0; i < str.length; i++) {
    encodedChar.push(String.fromCharCode(str.charCodeAt(i) + 10))
  }
  return encodedChar.join('');
}

class Signin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      password: '',
      hasFetchedData: false
    }
  }

  componentDidMount(){
    const userName = this.props.userName;
    if (this.props.mssqlConnected) {
      this.props.getUser(this.props.connectedHome)
    }
    this.setState({ userName })
  }

  signInAsync = async () => {
    if (!this.props.usersLoaded) {
      Alert.alert('Connexion Impossible', 'Merci de réessayer plus tard', [{ text: 'Ok' }]);
    } else {
      if (this.state.userName === '') {
        Alert.alert('Identifiants incorrects', 'Merci de saisir votre identifiant', [{ text: 'Ok' }]);
      } else if (this.state.password === '') {
        Alert.alert('Identifiants incorrects', 'Merci de saisir votre mot de passe', [{ text: 'Ok' }]);
      } else {

        const user = this.props.users.filter(t => (t.ON_Android === 'O' && t.Login === this.state.userName && t.Mdp === encoded(this.state.password)));
        if (user.length > 0) {
          const addTime = parseInt(JWT_EXPIRE, 10);
          const token = await jwt.sign({ iss: user[0].ID, exp: new Date().getTime() + addTime * 1000 }, JWT_SECRET, { alg: 'hs256'});
          this.props.login(this.state.userName, user[0], token)
          this.props.navigation.navigate('App');
        } else {
          Alert.alert('Identifiants incorrects', 'Merci de vérifier votre identifiant et mot de passe', [{ text: 'Ok' }]);
        }
      }
    }
  };

  render() {
    if (this.props.mssqlConnected && !this.state.hasFetchedData) {
      this.props.getUser(this.props.connectedHome)
      this.setState({hasFetchedData: true})
    }
    return (
      <Wrapper>
        <View style={{ alignItems : 'center' }}>
          <Image
            source={logo}
            style={{ width: 300, height: 200 }}
          />
        </View>
        <Title>OptiDoc</Title>
        <View style={{alignItems : "center"}}>
          <SwitchSelector
            disabled={this.props.connecting}
            initial={this.props.connectedHome ? 1 : 0}
            onPress={value => this.props.switchDb(value)}
            textColor={this.props.connecting ? Colors.thirdColor : Colors.mainColor}
            selectedColor="#fff"
            buttonColor={this.props.connecting ? Colors.thirdColor : Colors.mainColor}
            borderColor={this.props.connecting ? Colors.thirdColor : Colors.mainColor}
            hasPadding
            style={{ width: 80, margin: 10 }}
            options={[
              { value: false, customIcon: <Ionicons color={this.props.connectedHome ? this.props.connecting ? Colors.thirdColor : Colors.mainColor : '#fff'} name="md-briefcase" size={Layout.icon.small} /> },
              { value: true, customIcon: <Ionicons color={!this.props.connectedHome ? this.props.connecting ? Colors.thirdColor : Colors.mainColor : '#fff'} name="md-home" size={Layout.icon.small} /> },
            ]}
          />
        </View>
        <StyledInput 
          allowFontScaling
          onChangeText={(userName) => this.setState({ userName })}
          placeholder="Identifiant"
          value={this.state.userName}
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
  locked: PropTypes.bool.isRequired,
  isConnected: PropTypes.bool.isRequired,
  connectedHome: PropTypes.bool.isRequired,
  switchDb: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  mssqlConnected: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  userName: PropTypes.string.isRequired,
  usersLoaded: PropTypes.bool.isRequired,
  connecting: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  userName: state.user.userName,
  isConnected: state.network.isConnected,
  mssqlConnected: state.network.mssqlConnected,
  locked: state.user.locked,
  users: state.teams.users,
  usersLoaded: state.teams.usersLoaded,
  connectedHome: state.network.connectedHome,
  connecting: state.network.connecting
})

export default withNavigation(connect(mapStateToProps, { login, getUser, switchDb })(Signin));
