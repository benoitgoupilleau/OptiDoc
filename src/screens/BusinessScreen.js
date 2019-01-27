import React from 'react';
import { Text, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

import Business from '../components/business/Business'

import Layout from '../constants/Layout'

import { listAffaires, listDocs } from '../redux/selector/business'

const { width } = Dimensions.get('window');

const StyledScroll = styled(ScrollView)`
  background-color: #ededed;
  padding-bottom: ${Layout.space.large};
  width: ${width};
`;
class BusinessScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  
  render() {
    if (this.props.businesses.length > 0) {
      return (
        <Main>
          <StyledScroll>
            {this.props.businesses.map(b => <Business key={b} title={b} prep={this.props.docs[b].prep} rea={this.props.docs[b].rea} />)}
          </StyledScroll>
        </Main>
      );
    }
    return (
      <Main>
        <Text>Business Screen</Text>
      </Main>
    );
  }
}

const mapStateToProps = ({ user, teams, business }) => {
  const businesses = listAffaires([...teams.teamRights], user.id)
  const docs = listDocs(business.docs, businesses)
  return ({
    businesses,
    docs
  })
}

export default connect(mapStateToProps)(BusinessScreen);