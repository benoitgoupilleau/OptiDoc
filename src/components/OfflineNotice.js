import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Text, NetInfo, Dimensions, TouchableOpacity } from 'react-native';

import { connectivityChange, connectDb } from '../redux/actions/network';

import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const Wrapper = styled(View)`
  background-color: ${props => props.error ? Colors.errorBackground : Colors.warningBackground};
  height: 30px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: ${width};
`;

const Message = styled(Text)`
  color: ${props => props.error ? Colors.errorText : Colors.warningText};
`;

class OfflineNotice extends PureComponent {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    this.props.connectivityChange(isConnected);
    if (isConnected) {
      this.props.connectDb();
    }
  }

  render() {
    if (!this.props.isConnected) {
      return (
        <Wrapper error>
            <Message error>Vous êtes hors ligne</Message>
        </Wrapper>
      );
    } else if (this.props.mssqlFailed) {
      return (
        <Wrapper>
          <TouchableOpacity onPress={this.props.connectDb} >
            <Message>Connexion impossible à la base de données. Réessayer</Message>
          </TouchableOpacity>
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
})

OfflineNotice.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  mssqlFailed: PropTypes.bool.isRequired,
  connectivityChange: PropTypes.func.isRequired,
  connectDb: PropTypes.func.isRequired,
}


export default connect(mapStateToProps, { connectivityChange, connectDb })(OfflineNotice);