import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SwitchSelector from "react-native-switch-selector";
import { View, Alert, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import logo from '../assets/images/logo.png';

import Logout from './Logout';

import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

import { loginApi } from '../redux/actions/user'
import { switchDb } from '../redux/actions/network'

import { Wrapper, Title, StyledInput, StyledButton, Message, StyledText } from './Signing.styled'

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
    }
  }

  componentDidMount(){
    const userName = this.props.userName;
    this.setState({ userName })
  }

  signInAsync = async () => {
    if (this.state.userName === '') {
      Alert.alert('Identifiants incorrects', 'Merci de saisir votre identifiant', [{ text: 'Ok' }]);
    } else if (this.state.password === '') {
      Alert.alert('Identifiants incorrects', 'Merci de saisir votre mot de passe', [{ text: 'Ok' }]);
    } else {
      const encodedMdp = encoded(this.state.password);
      await this.props.loginApi(
        this.state.userName,
        encodedMdp,
        () => this.props.navigation.navigate('App'),
        () => Alert.alert('Identifiants incorrects', 'Merci de vérifier votre identifiant et mot de passe', [{ text: 'Ok' }])
      )
    }
  };

  render() {
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
  loginApi: PropTypes.func.isRequired,
  locked: PropTypes.bool.isRequired,
  isConnected: PropTypes.bool.isRequired,
  connectedHome: PropTypes.bool.isRequired,
  switchDb: PropTypes.func.isRequired,
  mssqlConnected: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  connecting: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  userName: state.user.userName,
  isConnected: state.network.isConnected,
  mssqlConnected: state.network.mssqlConnected,
  locked: state.user.locked,
  connectedHome: state.network.connectedHome,
  connecting: state.network.connecting
})

export default withNavigation(connect(mapStateToProps, { loginApi, switchDb })(Signin));
