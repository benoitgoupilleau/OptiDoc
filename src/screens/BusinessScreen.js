import React from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

import { listAffaires } from '../redux/selector/business'  

class BusinessScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle title='hello' />,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }
  
  render() { 
    return (
      <Main>
        <Text>Business Screen</Text>
      </Main>
    );
  }
}

const mapStateToProps = ({ user, teams }) => ({
  businesses: listAffaires([...teams.teamRights], user.id)
})

export default connect(mapStateToProps)(BusinessScreen);