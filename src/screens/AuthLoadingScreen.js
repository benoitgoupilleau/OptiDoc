import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActivityIndicator, PermissionsAndroid, Alert } from 'react-native';
import Main from '../components/Main';

import { connectDb } from '../redux/actions/network';
import { getUser } from '../redux/actions/team'
import { getDocs } from '../redux/actions/business'
import { downloadModels } from '../redux/actions/user'

const checkAccess = async () => {
  const isAuthorised = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  if (isAuthorised) {
    return true;
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
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
  usersLoaded,
  connectDb,
  navigation,
  getUser,
  downloadModels,
  modeleDocs,
  editedDocs}) => {
  checkAccess();
  if (!mssqlConnected && !mssqlConnectionFailed) {
    connectDb();
    if (usersLoaded) {
      navigation.navigate(token !== '' ? 'App' : 'Auth');
    } else {
      navigation.navigate('Auth');
    }
  } else {
    getUser();
    getDocs(editedDocs)
    downloadModels(modeleDocs)
    if (usersLoaded) {
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
  connectDb: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  token: state.user.bearerToken,
  editedDocs: state.user.editedDocs,
  mssqlConnected: state.network.mssqlConnected,
  mssqlConnectionFailed: state.network.mssqlConnectionFailed,
  usersLoaded: state.teams.usersLoaded,
  modeleDocs: state.business.docs.filter(d => d.Dossier1 === 'Modele'),
})

export default connect(mapStateToProps, { connectDb, getUser, getDocs, downloadModels })(AuthLoadingScreen);
