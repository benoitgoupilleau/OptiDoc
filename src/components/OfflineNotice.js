import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Text, NetInfo, Dimensions, TouchableOpacity } from 'react-native';

import { connectivityChange, connectDbOut } from '../redux/actions/network';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout'

const { width } = Dimensions.get('window');

const Wrapper = styled(View)`
  background-color: ${props => props.type === 'error' ? Colors.errorBackground : (props.type === 'warning' ? Colors.warningBackground : Colors.mainColor)};
  height: 30px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: ${width};
`;

const Message = styled(Text)`
  color: ${props => props.type === 'error' ? Colors.errorText : (props.type === 'warning' ? Colors.warningText : Colors.warningText)};
  font-size: ${Layout.font.small};
  padding: 0 3px;
`;

class OfflineNotice extends PureComponent {
  componentDidMount() {
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      const isConnected = connectionInfo.type === 'wifi' || connectionInfo.type === 'cellular';
      this.props.connectivityChange(isConnected);
    });
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    this.props.connectivityChange(isConnected);
  }

  render() {
    if (!this.props.isConnected) {
      return (
        <Wrapper type="error">
            <Message type="error">Mode hors ligne</Message>
        </Wrapper>
      );
    } else if (this.props.isConnected && !this.props.mssqlConnected) {
      return (
        <Wrapper type="warning">
          <TouchableOpacity onPress={this.props.connectDbOut} style={{ height: 30 }}>
            <Message type="warning" >Connexion perdue avec la base de données. Cliquer pour réessayer</Message>
          </TouchableOpacity>
        </Wrapper>
      );
    } else if (this.props.modeleDownloaded === 'in progress') {
      return (
        <Wrapper>
            <Message>Fichiers modèles en cours de téléchargement {this.props.nbDownloaded}/{this.props.totalModeles}</Message>
        </Wrapper>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  mssqlFailed: state.network.mssqlConnectionFailed,
  mssqlConnected: state.network.mssqlConnected,
  modeleDownloaded: state.user.modeleDownloaded,
  nbDownloaded: state.user.nbDownloaded,
  totalModeles: state.user.totalModeles
})

OfflineNotice.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  mssqlFailed: PropTypes.bool.isRequired,
  connectivityChange: PropTypes.func.isRequired,
  connectDbOut: PropTypes.func.isRequired,
}


export default connect(mapStateToProps, { connectivityChange, connectDbOut })(OfflineNotice);