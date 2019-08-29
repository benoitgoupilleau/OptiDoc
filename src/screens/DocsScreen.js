import React from 'react';
import { Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';
import { listAffaires, listDocs, listNewDocs } from '../redux/selector/business'

import BusinessWithDocs from '../components/business/BusinessWithDocs'

import Layout from '../constants/Layout'
import Colors from '../constants/Colors';

import { StyledScroll, Legend, LegendWrapper, LegendItem, Icons } from './DocsScreen.styled';

const { width } = Dimensions.get('window');

class DocsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait()
  }

  
  render() {
    const affaire =  this.props.navigation.getParam('affaire', '');

    if (affaire !== '' && !!this.props.docs[affaire]) {
      return (
        <Main>
          <StyledScroll width={width}>
            <Legend>
              <Text style={{paddingLeft: 5, paddingRight: 3, fontSize: 10, flexGrow: 1}}>Légende : </Text>
              <LegendWrapper width={width}>
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

DocsScreen.propTypes = {
  docs: PropTypes.object.isRequired,
  newDocs: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
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