import React from 'react';
import RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Pdf from 'react-native-pdf';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';
import { EXTERNAL_PATH } from 'react-native-dotenv';
import { Dimensions, Text, ActivityIndicator, View, TouchableOpacity } from 'react-native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

import { editFile } from '../redux/actions/user'
import { openFile } from '../services/openfile'

import Folder from '../constants/Folder'
import Colors from '../constants/Colors';

const rootDir = RNFS.DocumentDirectoryPath;

const Edit = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${Colors.mainColor};
  height: 30px;
`

const EditText = styled(Text)`
  color: white;
`;

class PdfScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }
  static navigationOptions = ({navigation}) => ({
    headerTitle: <HeaderTitle noLogo title={navigation.getParam('title', '')}/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  })

  componentDidMount() {
    Orientation.unlockAllOrientations();
    setTimeout(() => {
      this.setState({loading: false})
    }, 500);
  }

  onPressEdit = async (ID, Extension, filePath, isEdited) => {
    this.props.navigation.goBack();
    if (isEdited) {
      await openFile(ID, Extension)
    } else {
      this.props.editFile({ ID, editPath: `${EXTERNAL_PATH}${ID}.${Extension}`}, filePath)
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <Main>
          <ActivityIndicator />
        </Main>
      );
    } else {
      const isEdited = this.props.navigation.getParam('isEdited', false)
      const isPrepared = this.props.navigation.getParam('isPrepared', false)
      const ID = this.props.navigation.getParam('ID', '')
      const Extension = this.props.navigation.getParam('Extension', '')
      const Dossier1 = this.props.navigation.getParam('Dossier1', '')
      const Reviewed = this.props.navigation.getParam('Reviewed', '');
      const Prepared = this.props.navigation.getParam('Prepared', '');
      const type = this.props.navigation.getParam('type', Folder.prep)
      const filePath = isEdited ? `${EXTERNAL_PATH}${ID}.${Extension}` : `${rootDir}/${this.props.userId}/${Dossier1}/${type}/${ID}.${Extension}`;
  
      const source = { uri: filePath };
      return (
        <Main>
          <View>
            {type === Folder.rea && Reviewed === 'N' && (Prepared === 'N' || isPrepared) && (<Edit onPress={() => this.onPressEdit(ID, Extension, filePath, isEdited)}>
              <EditText>Modifier</EditText>
            </Edit>)}
            <Pdf
              source={source}
              fitPolicy={0}
              style={{
                flex: 1,
                width: Dimensions.get('window').width
              }}
            />
          </View>
        </Main>
      );
    }
      
    
  }
}

PdfScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  editFile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  userId: state.user.id
})

export default connect(mapStateToProps, { editFile })(PdfScreen);
