import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Alert, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import logo from '../assets/images/logo.png';

import Logout from './Logout';

import { loginApi } from '../redux/actions/user'

import { Wrapper, Title, StyledInput, StyledButton, Message, StyledText } from './Signing.styled'

const encoded = (str) => {
  const encodedChar = []
  for (let i = 0; i < str.length; i++) {
    encodedChar.push(String.fromCharCode(str.charCodeAt(i) + 10))
  }
  return encodedChar.join('');
}

const Signin = ({ userName, navigation, loginApi, locked, sessionExpired }) => {
  const [localUserName, setUserName] = useState(userName)
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInAsync = () => {
    if (localUserName === '') {
      Alert.alert('Identifiants incorrects', 'Merci de saisir votre identifiant', [{ text: 'Ok' }]);
    } else if (password === '') {
      Alert.alert('Identifiants incorrects', 'Merci de saisir votre mot de passe', [{ text: 'Ok' }]);
    } else {
      const encodedMdp = encoded(password);
      setLoading(true);
      loginApi(
        localUserName,
        encodedMdp,
        () => {
          setLoading(false)
          navigation.navigate('App')
        },
        () => {
          setLoading(false)
          Alert.alert('Identifiants incorrects', 'Merci de vérifier votre identifiant et mot de passe', [{ text: 'Ok' }])
        }
      )
    }

  }

  return (
    <Wrapper>
      <View style={{ alignItems: 'center' }}>
        <Image
          source={logo}
          style={{ width: 300, height: 200 }}
        />
      </View>
      <Title>OptiDoc</Title>
      {sessionExpired && <Message type="error">Votre session a expiré. Merci de vous reconnecter</Message>}
      <StyledInput
        allowFontScaling
        onChangeText={(userName) => setUserName(userName)}
        placeholder="Identifiant"
        value={localUserName}
        editable={!locked}
        returnKeyType="next"
      />
      <StyledInput
        allowFontScaling
        onChangeText={(password) => setPassword(password)}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        returnKeyType="done"
      />
      <Message>Mot de passe oublié ? Merci de contacter votre administrateur</Message>
      <StyledButton onPress={signInAsync} disabled={loading}>
        <StyledText>Connexion</StyledText>
      </StyledButton>
      {locked && <Logout title="Forcer la déconnexion" />}
    </Wrapper>
  )
}

Signin.propTypes = {
  navigation: PropTypes.object.isRequired,
  loginApi: PropTypes.func.isRequired,
  locked: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  sessionExpired: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  userName: state.user.userName,
  locked: state.user.locked,
  sessionExpired: state.user.sessionExpired
})

export default withNavigation(connect(mapStateToProps, { loginApi })(Signin));
