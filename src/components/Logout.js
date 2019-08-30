import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';

import Layout from '../constants/Layout'

import { logout } from '../redux/actions/user';
import { getNews } from '../redux/actions/news'
import { getDocs, getModeles, getBusiness, getAffaires, getArbo } from '../redux/actions/business'

import { Wrapper, Icons, StyledButton, StyledText } from './Logout.styled';

class Logout extends React.Component {
  state = {
    refreshing: false,
  }
  signOut = () => {
    if (this.props.hasEditFiles) {
      Alert.alert(
        'Etes-vous sûr de vouloir vous déconnecter ?',
        "Vous avez encore des fichiers modifiés en local que vous n'avez pas envoyés",
        [
          { text: 'Annuler', style: 'cancel'},
          { text: 'Oui', onPress: this.signOutAsync },
        ],
      )
    } else {
      this.signOutAsync();
    }
  }

  signOutAsync = () => {
    this.props.navigation.navigate('Auth');
    this.props.logout(this.props.userId);
  };

  refreshData = () => {
    this.setState({ refreshing: true})
    this.props.getNews(this.props.connectedHome)
    this.props.getDocs(this.props.connectedHome, this.props.docs, this.props.downloadedBusiness, this.props.editedDocs)
    this.props.getAffaires(this.props.connectedHome)
    this.props.getArbo(this.props.connectedHome)
    this.props.getBusiness(this.props.connectedHome);
    this.props.getModeles(this.props.connectedHome)
    setTimeout(() => {
      this.setState({ refreshing: false})
      ToastAndroid.showWithGravity(
        "Données en cours d'actualisation",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }, 2000)
  }

  render() {
    return (
      <Wrapper>
        {this.state.refreshing ?
        <ActivityIndicator style={{ paddingLeft: 20, paddingRight: 20 }}/> :
        <Icons
          name="md-refresh"
          size={Layout.icon.default}
          onPress={this.refreshData}
        />}
        <StyledButton onPress={this.signOut}>
          <StyledText>{this.props.title}</StyledText>
        </StyledButton>
      </Wrapper>
    );
  }
}

Logout.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  hasEditFiles: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  getNews: PropTypes.func.isRequired,
  getDocs: PropTypes.func.isRequired,
  getBusiness: PropTypes.func.isRequired,
  getModeles: PropTypes.func.isRequired,
  getAffaires: PropTypes.func.isRequired,
  getArbo: PropTypes.func.isRequired,
  editedDocs: PropTypes.array.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  uploadingDocs: PropTypes.array.isRequired,
  downloadedBusiness: PropTypes.array.isRequired,
  docs: PropTypes.array.isRequired,
  connectedHome: PropTypes.bool.isRequired
}

Logout.defaultProps = {
  title: 'Déconnexion'
}

const mapStateToProps = state => ({
  hasEditFiles: state.user.editedDocs.length > 0,
  userId: state.user.id,
  editedDocs: state.user.editedDocs,
  docs: state.business.docs,
  downloadedBusiness: state.user.downloadedBusiness,
  loadingBusiness: state.user.loadingBusiness,
  uploadingDocs: state.user.uploadingDocs,
  connectedHome: state.network.connectedHome
})

export default withNavigation(connect(mapStateToProps, {
  logout,
  getNews,
  getDocs,
  getAffaires,
  getArbo,
  getBusiness,
  getModeles,
})(Logout));