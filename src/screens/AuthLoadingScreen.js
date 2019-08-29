import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import Main from '../components/Main';

import { connectDbOut, connectDbHome } from '../redux/actions/network';
import { getUser } from '../redux/actions/team'
import { getDocs } from '../redux/actions/business'
import { downloadModels } from '../redux/actions/user'

import { checkAccessStorage } from '../utils/permissionsAndroid'

const  AuthLoadingScreen = ({token,
  mssqlConnected,
  mssqlConnectionFailed,
  usersLoaded,
  connectDbOut,
  connectDbHome,
  connectedHome,
  navigation,
  getUser,
  downloadModels,
  modeleDocs,
  editedDocs,
  docs,
  downloadedBusiness}) => {
  checkAccessStorage();
  if (!mssqlConnected && !mssqlConnectionFailed) {
    connectedHome ? connectDbHome() : connectDbOut();
    if (usersLoaded) {
      navigation.navigate(token !== '' ? 'App' : 'Auth');
    } else {
      navigation.navigate('Auth');
    }
  } else {
    getUser(connectedHome);
    getDocs(connectedHome, docs, downloadedBusiness, editedDocs)
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
  connectDbOut: PropTypes.func.isRequired,
  usersLoaded: PropTypes.bool.isRequired,
  connectDbHome: PropTypes.func.isRequired,
  connectedHome: PropTypes.bool.isRequired,
  getUser: PropTypes.func.isRequired,
  downloadModels: PropTypes.func.isRequired,
  modeleDocs: PropTypes.array.isRequired,
  editedDocs: PropTypes.array.isRequired,
  downloadedBusiness: PropTypes.array.isRequired,
  docs: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  token: state.user.bearerToken,
  editedDocs: state.user.editedDocs,
  downloadedBusiness: state.user.downloadedBusiness,
  mssqlConnected: state.network.mssqlConnected,
  mssqlConnectionFailed: state.network.mssqlConnectionFailed,
  usersLoaded: state.teams.usersLoaded,
  modeleDocs: state.business.docs.filter(d => (d.Dossier1 && d.Dossier1 === 'Modele')),
  docs: state.business.docs,
  connectedHome: state.network.connectedHome
})

export default connect(mapStateToProps, { connectDbOut, connectDbHome, getUser, getDocs, downloadModels })(AuthLoadingScreen);
