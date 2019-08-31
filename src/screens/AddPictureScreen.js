/* eslint-disable no-console */
import React from 'react';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';
import RNImageToPdf from 'react-native-image-to-pdf';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { Text, View, Dimensions, Alert } from 'react-native';
import { EXTERNAL_PATH } from 'react-native-dotenv';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle';
import OfflineNotice from '../components/OfflineNotice';

import Layout from '../constants/Layout'
import Folder from '../constants/Folder'

import { editFile } from '../redux/actions/user'
import { addNewDoc } from '../redux/actions/business'
import Sentry from '../services/sentry'

import rootDir from '../services/rootDir';
import { getDateFormat } from '../services/dateFormat';
import { checkAccessCamera } from '../utils/permissionsAndroid';

import { Wrapper, Title, Section, ButtonWrapper, StyledButton, StyledText, FileNameInput, Comment, StyledScroll, PictureWrapper, ImageFrame, Icons } from './AddPictureScreen.styled';

const { width, height } = Dimensions.get('window');

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
    checkAccessCamera();
  }

  getPhotos = () => {
    const options = {
      title: 'Selectionner une photo',
      takePhotoButtonTitle: 'Prendre une photo',
      cancelButtonTitle: 'Annuler',
      chooseFromLibraryButtonTitle: 'Choisir une photo dans la galerie...',
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (!response.didCancel && !response.error) {
        const now = new Date();
        const { day, month, year } = getDateFormat(now);
        const date = `${day}.${month}.${year}`;
        this.setState({
          ...response,
          pictureNameFinal: 'Photo ' + date 
        });
      }
    });
  };

  handleButtonPress = async () => {
    const isAuthorised = await checkAccessCamera();
    if (isAuthorised) {
      this.getPhotos();
    } else { 
      Alert.alert("L'application n'a pas accès à vos photos", "Merci de modifier les paramètres de l'application", [{ text: 'Ok' }])
    }
  }

  handleSelectPicture = (pictureName) => {
    const now = new Date();
    const { day, month, year } = getDateFormat(now);
    const date = `${day}.${month}.${year}`;
    this.setState({ pictureName, pictureNameFinal: `Photo ${date}` })
  }

  onCreatePicture = () => {
    this.setState({ creatingFile: true })
    const businessId = this.props.navigation.getParam('affaire', '')
    const now = new Date();
    const { day, month, year, hours, minutes, secondes } = getDateFormat(now);
    const CreatedOn = `${year}-${month}-${day}`;
    const date = `${year}${month}${day}${hours}${minutes}${secondes}`;
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
              Revisable: 'N',
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
            Sentry.captureException(e, { func: 'copyFile', doc: 'AddPictureScreen.js' })
            console.error({ e, func: 'copyFile', doc: 'AddPictureScreen.js' })
            this.setState({ creatingFile: false })
            return;
          })))
      .catch((e) => {
        Sentry.captureException(e, { func: 'onCreatePicture', doc: 'AddPictureScreen.js' })
        console.error({ e, func: 'onCreatePicture', doc: 'AddPictureScreen.js' })
        this.setState({ creatingFile: false })
        return;
      })
  }

  render() {
    const id_affaire = this.props.navigation.getParam('affaire', '')
    const business = this.props.userBusiness.find((b) => b.id === id_affaire)
    const clientName = business ? `${business.client} - ${business.designation}` : id_affaire;
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
            <StyledScroll width={width} height={height}>
              {this.state.uri ? (
                <PictureWrapper>
                  <ImageFrame
                    source={{ uri: this.state.uri }}
                    screenWidth={width}
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
  userBusiness: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  editFile: PropTypes.func.isRequired,
  addNewDoc: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  userBusiness: state.business.business,
  user: state.user,
  modeleDownloaded: state.user.modeleDownloaded
})

export default connect(mapStateToProps, { editFile, addNewDoc })(AddPictureScreen);