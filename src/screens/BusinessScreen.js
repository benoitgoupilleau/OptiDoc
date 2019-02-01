import React from 'react';
import { Text, ScrollView, Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

import Business from '../components/business/Business'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors';

import { listAffaires, listDocs } from '../redux/selector/business'

const { width } = Dimensions.get('window');

const StyledScroll = styled(ScrollView)`
  background-color: #ededed;
  padding-bottom: ${Layout.space.large};
  width: ${width};
`;

const Legend = styled(View)`
  flex-direction: row;
  padding: 5px 0;
`;

const LegendItem = styled(View)`
  flex-direction: row;
  padding: 0 5px;
  align-items: center;
`;

const Icons = styled(Ionicons)`
  padding: 0 10px;
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
          <Legend>
            <LegendItem>
              <Icons
                name="md-create"
                size={26}
              />
              <Text>Modifier</Text>
            </LegendItem>
            <LegendItem>
              <Icons
                name="md-cloud-upload"
                size={26}
                color={Colors.secondColor}
              />
              <Text>Envoyer</Text>
            </LegendItem>
            <LegendItem>
              <Icons
                name="md-close"
                size={26}
                color="red"
              />
              <Text>Annuler les modifications locales</Text>
            </LegendItem>
            <LegendItem>
              <Icons
                name="md-checkbox-outline"
                size={26}
              />
              <Text>Non Préparé</Text>
            </LegendItem>
            <LegendItem>
              <Icons
                name="md-checkbox-outline"
                size={26}
                color="green"
              />
              <Text>Préparé</Text>
            </LegendItem>
          </Legend>
          <StyledScroll>
            {this.props.businesses.map(b => <Business key={b} title={b} prep={this.props.docs[b].prep} rea={this.props.docs[b].rea} />)}
          </StyledScroll>
        </Main>
      );
    }
    return (
      <Main>
        <Text>Aucune affaire disponible</Text>
      </Main>
    );
  }
}

BusinessScreen.propTypes = {
  businesses: PropTypes.array.isRequired,
  docs: PropTypes.object.isRequired
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