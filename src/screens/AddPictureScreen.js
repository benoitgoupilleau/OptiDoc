import React from 'react';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import RNImageToPdf from 'react-native-image-to-pdf';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, View, TextInput, ScrollView, Dimensions, PermissionsAndroid, TouchableOpacity, Alert, Image } from 'react-native';
import styled from 'styled-components'
import { EXTERNAL_PATH } from 'react-native-dotenv';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle';
import OfflineNotice from '../components/OfflineNotice';

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import Folder from '../constants/Folder'

import { editFile } from '../redux/actions/user'
import { addNewDoc } from '../redux/actions/business'

const { width, height } = Dimensions.get('window');
const rootDir = RNFS.DocumentDirectoryPath;

const Wrapper = styled(View)`
  padding: 40px;
`;

const Title = styled(Text)`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  font-weight: bold;
  text-align: center;
`;

const Section = styled(Text)`
  font-size: ${Layout.font.large};
  font-weight: bold;
`

const ButtonWrapper = styled(View)`
  align-items: center;
`;

const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${props => props.disabled ? Colors.thirdColor : Colors.mainColor};
  height: 40px;
  margin: 10px 0;
  padding: ${Layout.space.small};
  text-align: center;
  width: 200px;
`;

const StyledText = styled(Text)`
  color: white;
  font-size: ${Layout.font.small};
`;


const FileNameInput = styled(TextInput)`
  width: 100%;
  border-color: ${Colors.thirdColor};
  margin: 10px 0;
  border-width: 1px;
`;

const Comment = styled(TextInput)`
  width: 100%;
  border-color: ${Colors.thirdColor};
  border-width: 1px;
`;

const StyledScroll = styled(ScrollView)`
  width: ${width};
  padding-bottom: ${Layout.space.large};
  height: ${height - 500}px;
`;

const PictureWrapper = styled(View)`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
`;

const ImageFrame = styled(Image)`
  width: ${width - 80}px;
  height: ${props => ((width - 80) * props.height) / props.width}px;
`;

const Icons = styled(Ionicons)`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const checkAccess = async () => {
  const isAuthorised = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
  if (isAuthorised) {
    return true;
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Optidoc demande l'acccès à vos photos",
          message:
            "Optidoc a besoin d'accéder à vos photos " +
            "pour que vous puissiez les ajouter",
          buttonPositive: 'Autoriser',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        Alert.alert(
          "L'application doit pouvoir accéder aux photos",
          "Impossible d'ajouter une photo sans accès à vos photos",
          [
            { text: 'Ok', onPress: () => checkAccess() },
          ],
        )
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

class AddPictureScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      comment: '',
      pictureNameFinal: '',
      creatingFile: false,
      path: ''
    }
  } 
  static navigationOptions = {
    headerTitle: <HeaderTitle noLogo title="Ajouter une photo"/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    checkAccess();
  }

  getPhotos = () => {
    const options = {
      title: 'Selectionner une photo',
      takePhotoButtonTitle: 'Prendre une photo',
      cancelButtonTitle: 'Annuler',
      chooseFromLibraryButtonTitle: 'Choisir une photo dans la galerie...',
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const now = new Date();
        const date = now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '.' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '.' + now.getFullYear()
        this.setState({
          ...response,
          pictureNameFinal: 'Photo ' + date 
        });
      }
    });
  };

  handleButtonPress = async () => {
    const isAuthorised = await checkAccess();
    if (isAuthorised) {
      this.getPhotos();
    } else { 
      Alert.alert("L'application n'a pas accès à vos photos", "Merci de modifier les paramètres de l'application", [{ text: 'Ok' }])
    }
  }

  handleSelectPicture = (pictureName) => {
    const now = new Date();
    const date = now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '.' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '.' + now.getFullYear()
    this.setState({ pictureName, pictureNameFinal: 'Photo ' + date })
  }

  onCreatePicture = () => {
    this.setState({ creatingFile: true })
    const businessId = this.props.navigation.getParam('affaire', '')
    const now = new Date();
    const CreatedOn = now.getFullYear() + '-' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '-' + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
    const date = now.getFullYear() + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) +
      + now.getHours().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + now.getMinutes().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + now.getMilliseconds().toLocaleString('fr-FR', { minimumIntegerDigits: 3 })
    const fileID = 'DOC_' + date;
    const Dossier3 = 'DOSS_5';
    const destPath = `${rootDir}/${this.props.user.id}/${businessId}/${Folder.rea}/${fileID}.pdf`;
    RNImageToPdf.createPDFbyImages({ imagePaths: [this.state.path], name: 'fileID' })
      .then((file) => RNFS.mkdir(`${rootDir}/${this.props.user.id}/${businessId}/${Folder.rea}`)
        .then(() => RNFS.copyFile(file.filePath, destPath)
          .then(() => {
            const newDoc = {
              LocalPath: '',
              Prepared: 'N',
              PreparedOn: '1900-01-01',
              PageNumber: 1,
              ReviewedOn: '1900-01-01',
              PreparedBy: '',
              Revisable: 'O',
              Size: 0,
              CreatedBy: this.props.user.name,
              Dossier2: 'Realisation',
              UpLoadedOn: '1900-01-01',
              FileName: this.state.pictureNameFinal,
              CreatedOn,
              Dossier1: businessId,
              ID: fileID,
              UpdatedOn: CreatedOn,
              UpdatedBy: this.props.user.name,
              Commentaire: this.state.comment,
              Dossier3,
              ServerPath: `${businessId}/Realisation/${Dossier3}/${fileID}.pdf`,
              ReviewedBy: '',
              Extension: 'pdf',
              Reviewed: 'N',
              Locked: 'N',
              UpLoadedBy: ''
            }
            this.props.navigation.goBack();
            this.props.editFile({ ID: fileID, editPath: `${EXTERNAL_PATH}${fileID}.pdf`, isNew: true, affaire: businessId, Extension: 'pdf', Dossier3 }, destPath)
            return this.props.addNewDoc(newDoc)
          })
          .catch(e => {
            console.log({ copyFile: e })
            this.setState({ creatingFile: false })
          })))
      .catch((e) => {
        console.log({ onCreatePicture: e })
        this.setState({ creatingFile: false })
      })
  }

  render() {
    const title = this.props.navigation.getParam('affaire', '')
    const affaire = this.props.affaires.filter(a => a.ID === title)[0]
    const clientName = affaire ? `${affaire.Client} - ${affaire.Designation}` : title;
    return (
      <View>
        <OfflineNotice />
        <Wrapper>
          <Title>{clientName}</Title>
          <Section>Ajouter une photo</Section>
          <View>
            <FileNameInput
              placeholder="Nom du fichier"
              onChangeText={(pictureNameFinal) => this.setState({ pictureNameFinal })}
              value={this.state.pictureNameFinal}
            />
            <Text>Commentaire obligatoire pour la photo :</Text>
            <Comment 
              multiline={true}
              onChangeText={(comment) => this.setState({ comment })}
              value={this.state.comment}
              returnKeyType="done"
            />
            <StyledButton onPress={this.handleButtonPress}>
              <StyledText>Sélectionner une photo</StyledText>
            </StyledButton>
            <ButtonWrapper>
              <StyledButton disabled={this.state.path === '' || this.state.comment === '' || this.state.creatingFile} onPress={this.onCreatePicture}>
                <StyledText>{this.state.creatingFile ? 'Création en cours' : 'Créer le fichier'}</StyledText>
              </StyledButton>
            </ButtonWrapper>
            <StyledScroll>
              {this.state.uri ? (
                <PictureWrapper>
                  <ImageFrame
                    source={{ uri: this.state.uri }}
                    width={this.state.width}
                    height={this.state.height}
                  />
                  <Icons
                    color="green"
                    name="md-checkmark-circle"
                    size={Layout.icon.default}
                  />
                </PictureWrapper>
              ) : <Text>Aucune photo sélectionnée</Text> }
            </StyledScroll>
          </View>
        </Wrapper>
      </View>
    );
  }
}

AddPictureScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  affaires: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  editFile: PropTypes.func.isRequired,
  addNewDoc: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  affaires: state.business.affaires,
  user: state.user,
  modeleDownloaded: state.user.modeleDownloaded
})

export default connect(mapStateToProps, { editFile, addNewDoc })(AddPictureScreen);