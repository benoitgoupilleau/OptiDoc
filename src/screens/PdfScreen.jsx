import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import Pdf from 'react-native-pdf';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';
import { EXTERNAL_PATH } from 'react-native-dotenv';
import { Dimensions, ActivityIndicator, View } from 'react-native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

import { editFile } from '../redux/actions/user'
import { openFile } from '../services/openfile'

import Folder from '../constants/Folder'
import Colors from '../constants/Colors';

import rootDir from '../services/rootDir';

const Edit = styled.TouchableOpacity`
  align-items: center;
  background-color: ${Colors.mainColor};
  height: 30px;
`

const EditText = styled.Text`
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

  onPressEdit = async (id, Extension, Dossier1, filePath, isEdited, Dossier3) => {
    this.props.navigation.goBack();
    if (isEdited) {
      await openFile(id, Extension)
    } else {
      this.props.editFile({ id, editPath: `${EXTERNAL_PATH}${id}.${Extension}`, affaire: Dossier1, Extension, Dossier3}, filePath)
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
      const isModel = this.props.navigation.getParam('isModel', false)
      const isPrepared = this.props.navigation.getParam('isPrepared', false)
      const id = this.props.navigation.getParam('id', '')
      const Extension = this.props.navigation.getParam('extension', '')
      const Dossier1 = this.props.navigation.getParam('dossier1', '')
      const Dossier3 = this.props.navigation.getParam('dossier3', '')
      const Reviewed = this.props.navigation.getParam('reviewed', '');
      const Locked = this.props.navigation.getParam('locked', '')
      const Prepared = this.props.navigation.getParam('prepared', '');
      const type = this.props.navigation.getParam('type', Folder.prep)
      const filePath = isEdited ? `${EXTERNAL_PATH}${id}.${Extension}` : 
        isModel ? `${rootDir}/${Folder.modeleDocs}/${id}.pdf` : `${rootDir}/${this.props.userId}/${Dossier1}/${type}/${id}.${Extension}`;
  
      const source = { uri: filePath };
      return (
        <Main>
          <View>
            {type === Folder.rea && Reviewed === 'N' && Locked === 'N' && (Prepared === 'N' || isPrepared) && (<Edit onPress={() => this.onPressEdit(id, Extension, Dossier1, filePath, isEdited, Dossier3)}>
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
