import React, { useState, useEffect } from 'react';
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

const AddPictureScreen = React.memo(({ navigation, user, userBusiness, editFile, addNewDoc }) => {
  const [comment, setComment] = useState('')
  const [pictureNameFinal, setpictureNameFinal] = useState('')
  const [creatingFile, setCreatingFile] = useState(false)
  const [path, setPath] = useState('');
  const [uri, setUri] = useState('')

  useEffect(() => {
    Orientation.lockToPortrait();
    checkAccessCamera();
  }, [])

  const getPhotos = () => {
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
        setPath(response.path)
        setUri(response.uri)
        setpictureNameFinal(`Photo ${date}`)
      }
    });
  };

  const handleButtonPress = async () => {
    const isAuthorised = await checkAccessCamera();
    if (isAuthorised) {
      getPhotos();
    } else {
      Alert.alert("L'application n'a pas accès à vos photos", "Merci de modifier les paramètres de l'application", [{ text: 'Ok' }])
    }
  }

  const onCreatePicture = () => {
    setCreatingFile(true)
    const businessId = navigation.getParam('affaire', '')
    const now = new Date();
    const { day, month, year, hours, minutes, secondes } = getDateFormat(now);
    const createdOn = `${year}-${month}-${day}`;
    const date = `${year}${month}${day}${hours}${minutes}${secondes}`;
    const fileID = 'DOC_' + date;
    const dossier3 = 'DOSS_5';
    const destPath = `${rootDir}/${user.id}/${businessId}/${Folder.rea}/${fileID}.pdf`;
    RNImageToPdf.createPDFbyImages({ imagePaths: [path], name: 'fileID' })
      .then((file) => RNFS.mkdir(`${rootDir}/${user.id}/${businessId}/${Folder.rea}`)
        .then(() => RNFS.copyFile(file.filePath, destPath)
          .then(() => {
            const newDoc = {
              localPath: '',
              prepared: 'N',
              preparedOn: '1900-01-01',
              pageNumber: 1,
              reviewedOn: '1900-01-01',
              preparedBy: '',
              revisable: 'N',
              size: 0,
              createdBy: user.name,
              dossier2: 'Realisation',
              upLoadedOn: '1900-01-01',
              fileName: pictureNameFinal,
              createdOn,
              dossier1: businessId,
              id: fileID,
              updatedOn: createdOn,
              updatedBy: user.name,
              commentaire: comment,
              dossier3,
              serverPath: `${businessId}/Realisation/${dossier3}/${fileID}.pdf`,
              reviewedBy: '',
              extension: 'pdf',
              reviewed: 'N',
              locked: 'N',
              upLoadedBy: ''
            }
            navigation.goBack();
            editFile({ id: fileID, editPath: `${EXTERNAL_PATH}${fileID}.pdf`, isNew: true, affaire: businessId, extension: 'pdf', dossier3 }, destPath)
            return addNewDoc(newDoc)
          })
          .catch(e => {
            Sentry.captureException(e, { func: 'copyFile', doc: 'AddPictureScreen.js' })
            setCreatingFile(false);
            return;
          })))
      .catch((e) => {
        Sentry.captureException(e, { func: 'onCreatePicture', doc: 'AddPictureScreen.js' })
        setCreatingFile(false);
        return;
      })
  }

  const id_affaire = navigation.getParam('affaire', '')
  const business = userBusiness.find((b) => b.id === id_affaire)
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
            onChangeText={(pictureNameFinal) => setpictureNameFinal(pictureNameFinal)}
            value={pictureNameFinal}
          />
          <Text>Commentaire obligatoire pour la photo :</Text>
          <Comment
            multiline={true}
            onChangeText={(comment) => setComment(comment)}
            value={comment}
            returnKeyType="done"
          />
          <StyledButton onPress={handleButtonPress}>
            <StyledText>Sélectionner une photo</StyledText>
          </StyledButton>
          <ButtonWrapper>
            <StyledButton disabled={path === '' || comment === '' || creatingFile} onPress={onCreatePicture}>
              <StyledText>{creatingFile ? 'Création en cours' : 'Créer le fichier'}</StyledText>
            </StyledButton>
          </ButtonWrapper>
          <StyledScroll width={width} height={height}>
            {uri ? (
              <PictureWrapper>
                <ImageFrame
                  source={{ uri: uri }}
                  screenWidth={width}
                  width={width}
                  height={height}
                />
                <Icons
                  color="green"
                  name="md-checkmark-circle"
                  size={Layout.icon.default}
                />
              </PictureWrapper>
            ) : <Text>Aucune photo sélectionnée</Text>}
          </StyledScroll>
        </View>
      </Wrapper>
    </View>
  );

})

AddPictureScreen.navigationOptions = {
  headerTitle: <HeaderTitle noLogo title="Ajouter une photo" />,
  headerRight: <Logout />,
  headerStyle: {
    height: 70
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