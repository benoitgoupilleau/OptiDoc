import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActivityIndicator, PermissionsAndroid, Alert } from 'react-native';
import Main from '../components/Main';

import { connectDb } from '../redux/actions/network';
import { getTeam, getTeamRight, getUser } from '../redux/actions/team'

const checkAccess = async () => {
  const isAuthorised = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
  if (isAuthorised) {
    return true;
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Optidoc demande l'acccès aux documents",
          message:
            "Optidoc a besoin d'accéder à vos documents " +
            "pour que vous puissiez les modifier",
          buttonPositive: 'Autoriser',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert(
          "L'application doit pouvoir accéder aux documents",
          "L'application est inutilisable sans accès aux documents. Merci de valider l'accès",
          [
            { text: 'Ok', onPress: () => checkAccess() },
          ],
        )
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

const  AuthLoadingScreen = ({token,
  mssqlConnected,
  mssqlConnectionFailed,
  teamLoaded,
  teamRightsLoaded,
  connectDb,
  navigation,
  getTeam,
  getUser,
  getTeamRight}) => {
  checkAccess();
  if (!mssqlConnected && !mssqlConnectionFailed) {
    connectDb();
  } else {
    getTeam();
    getUser();
    getTeamRight();
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
  getTeam: PropTypes.func.isRequired,
  getTeamRight: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  token: state.user.bearerToken,
  mssqlConnected: state.network.mssqlConnected,
  mssqlConnectionFailed: state.network.mssqlConnectionFailed,
  teamLoaded: state.teams.teamLoaded,
  usersLoaded: state.teams.usersLoaded,
  teamRightsLoaded: state.teams.teamRightsLoaded,
})

export default connect(mapStateToProps, { connectDb, getTeam, getUser, getTeamRight })(AuthLoadingScreen);
