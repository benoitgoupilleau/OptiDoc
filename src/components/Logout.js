import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { View, Button, AsyncStorage, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout'

import { logout } from '../redux/actions/user';

const Wrapper = styled(View)`
  margin: ${Layout.space.large};
`;

class Logout extends React.Component {
  signOut = () => {
    if (this.props.hasEditFiles) {
      Alert.alert(
        'Etes-vous sûr de vouloir vous déconnecter?',
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

  signOutAsync = async () => {
    await AsyncStorage.removeItem('userToken');
    this.props.logout();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <Wrapper>
        <Button color={Colors.mainColor} title={this.props.title} onPress={this.signOut} />
      </Wrapper>
    );
  }
}

Logout.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  hasEditFiles: PropTypes.bool.isRequired
}

Logout.defaultProps = {
  title: 'Déconnexion'
}

const mapStateToProps = state => ({
  hasEditFiles: state.user.editedDocs.length > 0
})

export default withNavigation(connect(mapStateToProps, { logout })(Logout));