import React, { useState, useEffect } from 'react';
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

const PdfScreen = ({ userId, navigation, editFile }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Orientation.unlockAllOrientations();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [])

  const onPressEdit = async (ID, Extension, Dossier1, filePath, isEdited, Dossier3) => {
    navigation.goBack();
    if (isEdited) {
      await openFile(ID, Extension)
    } else {
      editFile({ ID, editPath: `${EXTERNAL_PATH}${ID}.${Extension}`, affaire: Dossier1, Extension, Dossier3 }, filePath)
    }
  }

  const isEdited = navigation.getParam('isEdited', false)
  const isModel = navigation.getParam('isModel', false)
  const isPrepared = navigation.getParam('isPrepared', false)
  const ID = navigation.getParam('ID', '')
  const Extension = navigation.getParam('Extension', '')
  const Dossier1 = navigation.getParam('Dossier1', '')
  const Dossier3 = navigation.getParam('Dossier3', '')
  const Reviewed = navigation.getParam('Reviewed', '');
  const Locked = navigation.getParam('Locked', '')
  const Prepared = navigation.getParam('Prepared', '');
  const type = navigation.getParam('type', Folder.prep)
  const filePath = isEdited ? `${EXTERNAL_PATH}${ID}.${Extension}` :
    isModel ? `${rootDir}/${Folder.modeleDocs}/${ID}.pdf` : `${rootDir}/${userId}/${Dossier1}/${type}/${id}.${Extension}`;

  const source = { uri: filePath };

  if (loading) {
    return (
      <Main>
        <ActivityIndicator />
      </Main>
    );
  }
  return (
    <Main>
      <View>
        {type === Folder.rea && Reviewed === 'N' && Locked === 'N' && (Prepared === 'N' || isPrepared) && (<Edit onPress={() => onPressEdit(ID, Extension, Dossier1, filePath, isEdited, Dossier3)}>
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

PdfScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: <HeaderTitle noLogo title={navigation.getParam('title', '')} />,
  headerRight: <Logout />,
  headerStyle: {
    height: 70
  }
})

PdfScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  editFile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  userId: state.user.userId
})

export default connect(mapStateToProps, { editFile })(PdfScreen);
