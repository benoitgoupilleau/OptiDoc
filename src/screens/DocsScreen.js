import React from 'react';
import { Text, ScrollView, Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';
import { listAffaires, listDocs, listNewDocs } from '../redux/selector/business'

import BusinessWithDocs from '../components/business/BusinessWithDocs'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const StyledScroll = styled(ScrollView)`
  background-color: #ededed;
  padding-bottom: ${Layout.space.large};
  width: ${width};
`;

const Legend = styled(View)`
  align-items: center;
  flex-direction: row;
  padding: 5px 0;
  font-size: 10px;
`;

const LegendWrapper = styled(View)`
  flex-flow: row wrap;
  flex-grow: 1;
  width: ${width-40}px;
`

const LegendItem = styled(View)`
  flex-direction: row;
  padding: 0 5px;
  align-items: center;
`;

const Icons = styled(Ionicons)`
  padding: 0 3px;
`;

class DocsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  
  render() {
    const affaire =  this.props.navigation.getParam('affaire', '');

    if (affaire !== '') {
      return (
        <Main>
          <StyledScroll>
            <Legend>
              <Text style={{paddingLeft: 5, paddingRight: 3, fontSize: 10, flexGrow: 1}}>Légende : </Text>
              <LegendWrapper>
                <LegendItem>
                  <Icons
                    name="md-create"
                    size={Layout.icon.xsmall}
                  />
                  <Text style={{ fontSize: 10}}>Modifier</Text>
                </LegendItem>
                <LegendItem>
                  <Icons
                    name="md-cloud-upload"
                    size={Layout.icon.xsmall}
                    color={Colors.secondColor}
                  />
                  <Text style={{ fontSize: 10}}>Envoyer</Text>
                </LegendItem>
                <LegendItem>
                  <Icons
                    name="md-close"
                    size={Layout.icon.xsmall}
                    color="red"
                  />
                  <Text style={{ fontSize: 10}}>Annuler les modifications locales</Text>
                </LegendItem>
                <LegendItem>
                  <Icons
                    name="md-checkbox-outline"
                    size={Layout.icon.xsmall}
                  />
                  <Text style={{ fontSize: 10}}>Non Préparé</Text>
                </LegendItem>
                <LegendItem>
                  <Icons
                    name="md-checkbox-outline"
                    size={Layout.icon.xsmall}
                    color="green"
                  />
                  <Text style={{ fontSize: 10}}>Préparé</Text>
                </LegendItem>
              </LegendWrapper>
            </Legend>
            <BusinessWithDocs key={affaire} title={affaire} prep={this.props.docs[affaire].prep} rea={this.props.docs[affaire].rea} newDocs={this.props.newDocs[affaire]} />
          </StyledScroll>
        </Main>
      );
    }
    return (
      <Main>
        <Text>Aucun document disponible</Text>
      </Main>
    );
  }
}

const mapStateToProps = ({ user, business }) => {
  const businesses = listAffaires(business.business, user.id)
  const docs = listDocs(business.docs, business.newDocs, businesses)
  const newDocs = listNewDocs(business.newDocs, businesses)
  return ({
    docs,
    newDocs,
  })
}

export default connect(mapStateToProps)(DocsScreen);