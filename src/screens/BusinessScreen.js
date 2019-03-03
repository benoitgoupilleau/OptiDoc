import React from 'react';
import { Text, ScrollView, Dimensions, View } from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

import Business from '../components/business/Business'

import Layout from '../constants/Layout'

import { listAffaires, listDocs, listNewDocs } from '../redux/selector/business'
import { downloadModels } from '../redux/actions/user'

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

  componentDidMount() {
    Orientation.lockToPortrait();
    if (this.props.modeleDownloaded !== 'in progress' && this.props.mssqlConnected) {
      this.props.downloadModels(this.props.modeleDocs);
    }
  }

  
  render() {
    if (this.props.businesses.length > 0) {
      return (
        <Main>
          <View>
            <StyledScroll>
              {this.props.businesses.map(b => <Business key={b} title={b} prep={this.props.docs[b].prep} rea={this.props.docs[b].rea} newDocs={this.props.newDocs[b]} />)}
            </StyledScroll>
          </View>
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
  docs: PropTypes.object.isRequired,
  newDocs: PropTypes.object.isRequired,
  mssqlConnected: PropTypes.bool.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  modeleDocs: PropTypes.array.isRequired,
  downloadModels: PropTypes.func.isRequired
}


const mapStateToProps = ({ user, business, network }) => {
  const businesses = listAffaires(business.business, user.id)
  const docs = listDocs(business.docs, business.newDocs, businesses)
  const newDocs = listNewDocs(business.newDocs, businesses)
  return ({
    businesses,
    docs,
    newDocs,
    modeleDownloaded: user.modeleDownloaded,
    mssqlConnected: network.mssqlConnected,
    modeleDocs: business.docs.filter(d => (d.Dossier1 && d.Dossier1 === 'Modele')),
  })
}

export default connect(mapStateToProps, { downloadModels })(BusinessScreen);