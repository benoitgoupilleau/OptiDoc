import React from 'react';
import RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import { Dimensions, Text, ActivityIndicator } from 'react-native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

const rootDir = RNFS.DocumentDirectoryPath;

class PdfScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <HeaderTitle title={navigation.getParam('title', '')}/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  })

  render() {
    const ID = this.props.navigation.getParam('ID', '')
    const Dossier3 = this.props.navigation.getParam('Dossier3', '')
    const Extension = this.props.navigation.getParam('Extension', '')
    const Dossier1 = this.props.navigation.getParam('Dossier1', '')
    const type = this.props.navigation.getParam('type', 'Prep')
    const filePath = (ID === '' || Dossier3 === '' || Extension === '' || Dossier1 === '') ? '' :
      `${rootDir}/${this.props.userId}/${Dossier1}/${type}/${ID}.${Extension}`;
    if (filePath !== '') {
      const source = { uri: filePath};
      return (
        <Main>
          <Pdf
            activityIndicator={<ActivityIndicator />}
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
  userId: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  userId: state.user.id
})

export default connect(mapStateToProps)(PdfScreen);
