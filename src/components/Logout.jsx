import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';

import Layout from '../constants/Layout'

import { logout } from '../redux/actions/user';
import { getNews } from '../redux/actions/news'
import { getDocs, getModeles, getBusiness, getArbo } from '../redux/actions/business'

import { Wrapper, Icons, StyledButton, StyledText } from './Logout.styled';

const Logout = React.memo(({ hasEditFiles, navigation, logout, userId, getNews, getDocs, getArbo, getBusiness, getModeles, docs, downloadedBusiness, editedDocs, title }) => {
  const [refreshing, setRefreshing] = useState(false);

  const signOut = () => {
    if (hasEditFiles) {
      Alert.alert(
        'Etes-vous sûr de vouloir vous déconnecter ?',
        "Vous avez encore des fichiers modifiés en local que vous n'avez pas envoyés",
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Oui', onPress: signOutAsync },
        ],
      )
    } else {
      signOutAsync();
    }
  }
  
  const signOutAsync = () => {
    navigation.navigate('Auth');
    logout(userId);
  };

  const refreshData = () => {
    setRefreshing(true);
    getNews()
    getDocs(docs, downloadedBusiness, editedDocs)
    getArbo()
    getBusiness();
    getModeles()
    setTimeout(() => {
      setRefreshing(false);
      ToastAndroid.showWithGravity(
        "Données en cours d'actualisation",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }, 2000)
  }

  return (
    <Wrapper>
      {refreshing ?
        <ActivityIndicator style={{ paddingLeft: 20, paddingRight: 20 }} /> :
        <Icons
          name="md-refresh"
          size={Layout.icon.default}
          onPress={refreshData}
        />}
      <StyledButton onPress={signOut}>
        <StyledText>{title}</StyledText>
      </StyledButton>
    </Wrapper>
  );
}) 

Logout.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  hasEditFiles: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  getNews: PropTypes.func.isRequired,
  getDocs: PropTypes.func.isRequired,
  getBusiness: PropTypes.func.isRequired,
  getModeles: PropTypes.func.isRequired,
  getArbo: PropTypes.func.isRequired,
  editedDocs: PropTypes.array.isRequired,
  uploadingDocs: PropTypes.array.isRequired,
  downloadedBusiness: PropTypes.array.isRequired,
  docs: PropTypes.array.isRequired,
}

Logout.defaultProps = {
  title: 'Déconnexion'
}

const mapStateToProps = state => ({
  hasEditFiles: state.user.editedDocs.length > 0,
  userId: state.user.userId,
  editedDocs: state.user.editedDocs,
  docs: state.business.docs,
  downloadedBusiness: state.user.downloadedBusiness,
  uploadingDocs: state.user.uploadingDocs,
})

export default withNavigation(connect(mapStateToProps, {
  logout,
  getNews,
  getDocs,
  getArbo,
  getBusiness,
  getModeles,
})(Logout));