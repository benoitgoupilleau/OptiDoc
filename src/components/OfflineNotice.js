import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View, Text, NetInfo, Dimensions } from 'react-native';

import { connectivityChange, connectDb } from '../redux/actions/network';
import { getNews } from '../redux/actions/news'
import { getDocs } from '../redux/actions/business'
import { getTeam, getTeamRight } from '../redux/actions/team'

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
  constructor(props) {
    super(props);
    this.dbInterval = undefined;
    this.refreshInterval = undefined;
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    clearInterval(this.dbInterval);
    clearInterval(this.refreshInterval)
  }

  handleConnectivityChange = isConnected => {
    this.props.connectivityChange(isConnected);
    if (isConnected) {
      this.props.connectDb();
    }
  }

  render() {
    if (!this.props.isConnected) {
      clearInterval(this.dbInterval);
      clearInterval(this.refreshInterval)
      return (
        <Wrapper error>
          <Message error>Vous êtes hors ligne</Message>
        </Wrapper>
      );
    } else if (this.props.mssqlFailed) {
      clearInterval(this.refreshInterval)
      this.dbInterval = setInterval(() => {
        this.props.connectDb();
      }, 2000); // Retry every 2s
      return (
        <Wrapper>
          <Message>Connexion impossible à la base de données</Message>
        </Wrapper>
      );
    }
    this.refreshInterval = setInterval(() => {
      this.props.getNews()
      this.props.getDocs()
      this.props.getTeam()
      this.props.getTeamRight()
    }, 1000 * 60 * 30); // refresh every 30min
    clearInterval(this.dbInterval);
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
  getNews: PropTypes.func.isRequired,
  getDocs: PropTypes.func.isRequired,
  getTeam: PropTypes.func.isRequired,
  getTeamRight: PropTypes.func.isRequired,
}


export default connect(mapStateToProps, {
  connectivityChange,
  connectDb,
  getNews,
  getDocs,
  getTeam,
  getTeamRight
})(OfflineNotice);