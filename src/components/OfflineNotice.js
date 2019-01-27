import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Text, NetInfo, Dimensions } from 'react-native';

import { connectivityChange } from '../redux/actions/network'
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const Wrapper = styled(View)`
  background-color: ${Colors.errorBackground};
  height: 30px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: ${width};
`;

const Message = styled(Text)`
  color: ${Colors.errorText};
`;

class OfflineNotice extends PureComponent {
  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => this.props.connectivityChange(isConnected);

  render() {
    if (!this.props.isConnected) {
      return (
        <Wrapper>
          <Message>Vous êtes hors ligne</Message>
        </Wrapper>
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected
})

OfflineNotice.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  connectivityChange: PropTypes.func.isRequired
}


export default connect(mapStateToProps, { connectivityChange })(OfflineNotice);