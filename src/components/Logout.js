import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, TouchableOpacity, Text, Alert, ToastAndroid, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout'

import { logout } from '../redux/actions/user';
import { getNews } from '../redux/actions/news'
import { getDocs, getModeles, getBusiness, getAffaires } from '../redux/actions/business'
import { getTeam, getTeamRight } from '../redux/actions/team'

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
  height: 28px;
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
    this.props.logout(this.props.userId);
    this.props.navigation.navigate('Auth');
  };

  refreshData = () => {
    this.setState({ refreshing: true})
    this.props.getNews()
    this.props.getDocs()
    this.props.getAffaires()
    this.props.getBusiness();
    this.props.getModeles()
    this.props.getTeam()
    this.props.getTeamRight()
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
          size={20}
          onPress={this.refreshData}
        />}
        <StyledButton onPress={this.signOut}>
          <StyledText>{this.props.title}</StyledText>
        </StyledButton>
        {/* <StyledButton color={Colors.mainColor} title={this.props.title} onPress={this.signOut} /> */}
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
  getTeam: PropTypes.func.isRequired,
  getTeamRight: PropTypes.func.isRequired,
}

Logout.defaultProps = {
  title: 'Déconnexion'
}

const mapStateToProps = state => ({
  hasEditFiles: state.user.editedDocs.length > 0,
  userId: state.user.id
})

export default withNavigation(connect(mapStateToProps, {
  logout,
  getNews,
  getDocs,
  getAffaires,
  getBusiness,
  getModeles,
  getTeam,
  getTeamRight
})(Logout));