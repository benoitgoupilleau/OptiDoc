import React from 'react';
import RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Pdf from 'react-native-pdf';
import PropTypes from 'prop-types';
import { Dimensions, Text, ActivityIndicator, View, TouchableOpacity } from 'react-native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Main from '../components/Main';

import { editFile } from '../redux/actions/user'

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
    headerTitle: <HeaderTitle title={navigation.getParam('title', '')}/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  })

  componentDidMount() {
    setTimeout(() => {
      this.setState({loading: false})
    }, 500);
  }

  render() {
    const ID = this.props.navigation.getParam('ID', '')
    const Dossier3 = this.props.navigation.getParam('Dossier3', '')
    const Extension = this.props.navigation.getParam('Extension', '')
    const Dossier1 = this.props.navigation.getParam('Dossier1', '')
    const type = this.props.navigation.getParam('type', Folder.prep)
    const filePath = (ID === '' || Dossier3 === '' || Extension === '' || Dossier1 === '') ? '' :
      `${rootDir}/${this.props.userId}/${Dossier1}/${type}/${ID}.${Extension}`;
    if (this.state.loading) {
      return (
        <Main>
          <ActivityIndicator />
        </Main>
      );
    } else {
      if (filePath !== '') {
        const source = { uri: filePath };
        return (
          <Main>
            <View>
              {type === Folder.rea && (<Edit onPress={() => this.props.editFile(ID, filePath)}>
                <EditText>Modifier</EditText>
              </Edit>)}
              <Pdf
                source={source}
                style={{
                  flex: 1,
                  width: Dimensions.get('window').width
                }}
              />
            </View>
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
