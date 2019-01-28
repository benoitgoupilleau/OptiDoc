/* global require */
import React from 'react';
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import { Dimensions, Text } from 'react-native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

class PdfScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <HeaderTitle title={navigation.getParam('title', '')}/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  })

  render() {
    const filePath = this.props.navigation.getParam('filePath', '')
    if (filePath !== '') {
      const source = require(filePath);
      console.log({source})
      return (
        <Main>
          <Pdf
            source={source}
            style={{
              flex: 1,
              width: Dimensions.get('window').width
            }}
          />
        </Main>
      );
    }
    return (
      <Main>
        <Text>Document introuvable</Text>
      </Main>
    );
    
  }
}

PdfScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default PdfScreen;
