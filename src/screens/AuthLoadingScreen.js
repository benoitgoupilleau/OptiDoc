import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import Main from '../components/Main';

import { checkAccessStorage } from '../utils/permissionsAndroid'

const  AuthLoadingScreen = ({token, navigation }) => {
  checkAccessStorage();
  navigation.navigate(token !== '' ? 'App' : 'Auth');
  return (
    <Main>
      <ActivityIndicator />
    </Main>
  );
}

AuthLoadingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  token: state.user.bearerToken,
})

export default connect(mapStateToProps)(AuthLoadingScreen);
