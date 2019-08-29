import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dimensions, TouchableOpacity } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import { connectivityChange, connectDbOut, connectDbHome } from '../redux/actions/network';

import { Wrapper, Message } from './OfflineNotice.styled';

const { width } = Dimensions.get('window');

class OfflineNotice extends PureComponent {
  componentDidMount() {
    NetInfo.getConnectionInfo().then((connectionInfo) => {
      const isConnected = connectionInfo.type === 'wifi' || connectionInfo.type === 'cellular';
      this.props.connectivityChange(isConnected);
    });
    NetInfo.addEventListener(this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(this.handleConnectivityChange);
  }

  handleConnectivityChange = state => {
    this.props.connectivityChange(state.isInternetReachable);
  }

  testDb = () => {
    if(this.props.connectedHome) return this.props.connectDbHome();
    return this.props.connectDbOut();
  }

  render() {
    if (!this.props.isConnected) {
      return (
        <Wrapper type="error" width={width}>
            <Message type="error">Mode hors ligne</Message>
        </Wrapper>
      );
    } else if (this.props.isConnected && !this.props.mssqlConnected) {
      return (
        <Wrapper type="warning" width={width}>
          {this.props.connecting ? 
            <Message type="warning" >Connexion en cours ...</Message> :
          <TouchableOpacity onPress={this.testDb} style={{ height: 30 }}>
            <Message type="warning" >Connexion perdue avec la base de données. Cliquer pour réessayer</Message>
          </TouchableOpacity>}
        </Wrapper>
      );
    } else if (this.props.modeleDownloaded === 'in progress') {
      return (
        <Wrapper width={width}>
            <Message>Fichiers modèles en cours de téléchargement {this.props.nbDownloaded}/{this.props.totalModeles}</Message>
        </Wrapper>
      );
    }
    return null;
  }
}

OfflineNotice.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  mssqlFailed: PropTypes.bool.isRequired,
  connectivityChange: PropTypes.func.isRequired,
  connectDbOut: PropTypes.func.isRequired,
  connectedHome: PropTypes.bool.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  nbDownloaded: PropTypes.number.isRequired,
  totalModeles: PropTypes.number.isRequired,
  mssqlConnected: PropTypes.bool.isRequired,
  connectDbHome: PropTypes.func.isRequired,
  connecting: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  mssqlFailed: state.network.mssqlConnectionFailed,
  mssqlConnected: state.network.mssqlConnected,
  modeleDownloaded: state.user.modeleDownloaded,
  nbDownloaded: state.user.nbDownloaded,
  totalModeles: state.user.totalModeles,
  connectedHome: state.network.connectedHome,
  connecting: state.network.connecting
})

export default connect(mapStateToProps, { connectivityChange, connectDbOut, connectDbHome })(OfflineNotice);