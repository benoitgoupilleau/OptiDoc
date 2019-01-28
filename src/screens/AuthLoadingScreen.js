import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import Main from '../components/Main';

import { connectDb, connectFtp } from '../redux/actions/network'

const  AuthLoadingScreen = (props) => {
  const {
    token,
    mssqlConnected,
    mssqlConnectionFailed,
    teamLoaded,
    teamRightsLoaded,
    connectDb,
    ftpConnected,
    ftpConnectionFailed,
    connectFtp,
    navigation
  } = props

  if (!ftpConnected && !ftpConnectionFailed) {
    connectFtp();
  }
  if (!mssqlConnected && !mssqlConnectionFailed) {
    connectDb();
  } else {
    if (teamLoaded && teamRightsLoaded) {
      navigation.navigate(token !== '' ? 'App' : 'Auth');
    } else {
      navigation.navigate('Auth');
    }
  }
  return (
    <Main>
      <ActivityIndicator />
    </Main>
  );
}

AuthLoadingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  mssqlConnected: PropTypes.bool.isRequired,
  mssqlConnectionFailed: PropTypes.bool.isRequired,
  teamLoaded: PropTypes.bool.isRequired,
  teamRightsLoaded: PropTypes.bool.isRequired,
  connectDb: PropTypes.func.isRequired,
  ftpConnected: PropTypes.bool.isRequired,
  ftpConnectionFailed: PropTypes.bool.isRequired,
  connectFtp: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  token: state.user.bearerToken,
  mssqlConnected: state.network.mssqlConnected,
  mssqlConnectionFailed: state.network.mssqlConnectionFailed,
  teamLoaded: state.teams.teamLoaded,
  teamRightsLoaded: state.teams.teamRightsLoaded,
  ftpConnected: state.network.ftpConnected,
  ftpConnectionFailed: state.network.ftpConnectionFailed,
})

export default connect(mapStateToProps, { connectDb, connectFtp })(AuthLoadingScreen);
