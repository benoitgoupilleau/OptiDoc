import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { View, Text, NetInfo, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const Wrapper = styled(View)`
  background-color: #b52424;
  height: 30px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: ${width};
`;

const Message = styled(Text)`
  color: #fff;
`;

class OfflineNotice extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      isConnected: true
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => this.setState({ isConnected });

  render() {
    if (!this.state.isConnected) {
      return (
        <Wrapper>
          <Message>Vous êtes hors ligne</Message>
        </Wrapper>
      );
    }
    return null;
  }
}


export default OfflineNotice;