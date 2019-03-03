import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SwitchSelector from "react-native-switch-selector";
import { View, TouchableOpacity, Text, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout'

import { logout } from '../redux/actions/user';
import { getNews } from '../redux/actions/news'
import { switchDb } from '../redux/actions/network';
import { getDocs, getModeles, getBusiness, getAffaires, getArbo } from '../redux/actions/business'
import { getUser } from '../redux/actions/team'

const Wrapper = styled(View)`
  margin: ${Layout.space.large};
  flex-direction: row;
  align-items: center;
`;

const Icons = styled(Ionicons)`
  padding: 0 20px;
`;

const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${Colors.mainColor};
  height: 32px;
  text-align: center;
`

const StyledText = styled(Text)`
  color: white;
  padding: 5px;
  font-size: ${Layout.font.small};
`;

class Logout extends React.Component {
  state = {
    refreshing: false,
  }
  signOut = () => {
    if (this.props.hasEditFiles) {
      Alert.alert(
        'Etes-vous sûr de vouloir vous déconnecter ?',
        'Vous avez encore des fichiers modifiés en local. Ces modifications seront perdues',
        [
          { text: 'Annuler'},
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
    this.props.getNews()
    this.props.getDocs(this.props.editedDocs)
    this.props.getAffaires()
    this.props.getArbo()
    this.props.getBusiness();
    this.props.getModeles()
    this.props.getUser()
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
        <SwitchSelector
          initial={this.props.connectedHome ? 1 : 0}
          onPress={value => this.props.switchDb(value)}
          textColor={Colors.mainColor}
          selectedColor="#fff"
          buttonColor={Colors.mainColor}
          borderColor={Colors.mainColor}
          hasPadding
          disabled={this.props.loadingBusiness.length > 0 || this.props.uploadingDocs.length > 0}
          style={{ width: 80, marginRight: 10}}
          options={[
            { value: false, customIcon: <Ionicons color={this.props.connectedHome ? Colors.mainColor : '#fff'} name="md-briefcase" size={Layout.icon.small} /> },
            { value: true, customIcon: <Ionicons color={!this.props.connectedHome ? Colors.mainColor : '#fff'} name="md-home" size={Layout.icon.small} /> },
          ]}
        />
        <StyledButton onPress={this.signOut} disabled={this.props.loadingBusiness.length > 0 || this.props.uploadingDocs.length > 0}>
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
  getUser: PropTypes.func.isRequired,
  getAffaires: PropTypes.func.isRequired,
  getArbo: PropTypes.func.isRequired,
  editedDocs: PropTypes.array.isRequired,
  connectedHome: PropTypes.bool.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  uploadingDocs: PropTypes.array.isRequired,
  switchDb: PropTypes.func.isRequired,
}

Logout.defaultProps = {
  title: 'Déconnexion'
}

const mapStateToProps = state => ({
  hasEditFiles: state.user.editedDocs.length > 0,
  userId: state.user.id,
  editedDocs: state.user.editedDocs,
  connectedHome: state.network.connectedHome,
  loadingBusiness: state.user.loadingBusiness,
  uploadingDocs: state.user.uploadingDocs
})

export default withNavigation(connect(mapStateToProps, {
  logout,
  getNews,
  getDocs,
  getAffaires,
  getArbo,
  getBusiness,
  getModeles,
  getUser,
  switchDb
})(Logout));