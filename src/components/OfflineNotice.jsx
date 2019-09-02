import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import { connectivityChange } from '../redux/actions/network';

import { Wrapper, Message } from './OfflineNotice.styled';

const { width } = Dimensions.get('window');

const OfflineNotice = React.memo(({ isConnected, modeleDownloaded, nbDownloaded, totalModeles, connectivityChange }) => {
  useEffect(() => {
    NetInfo.fetch().then((connectionInfo) => {
      const currentConnection = connectionInfo.type === 'wifi' || connectionInfo.type === 'cellular';
      if (isConnected !== currentConnection) connectivityChange(currentConnection);
    });
    NetInfo.addEventListener(handleConnectivityChange);
    return () => {
      NetInfo.removeEventListener(handleConnectivityChange);
    };
  }, [])

  const handleConnectivityChange = state => {
    const newConnection = state.isConnected;
    if (isConnected !== newConnection) connectivityChange(newConnection);
  }

  if (!isConnected) {
    return (
      <Wrapper type="error" width={width}>
        <Message type="error">Mode hors ligne</Message>
      </Wrapper>
    );
  } else if (modeleDownloaded === 'in progress') {
    return (
      <Wrapper width={width}>
        <Message>Fichiers modèles en cours de téléchargement {nbDownloaded}/{totalModeles}</Message>
      </Wrapper>
    );
  }
  return null;
})

OfflineNotice.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  connectivityChange: PropTypes.func.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  nbDownloaded: PropTypes.number.isRequired,
  totalModeles: PropTypes.number.isRequired,
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  modeleDownloaded: state.user.modeleDownloaded,
  nbDownloaded: state.user.nbDownloaded,
  totalModeles: state.user.totalModeles,
})

export default connect(mapStateToProps, { connectivityChange })(OfflineNotice);