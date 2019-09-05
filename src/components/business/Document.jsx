import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActivityIndicator, Dimensions, Alert, ToastAndroid } from 'react-native';
import pick from 'lodash.pick';
import RNFS from 'react-native-fs';
import { EXTERNAL_PATH } from 'react-native-dotenv';
import { withNavigation } from 'react-navigation';
import { downloadBusiness, editFile, uploadFile, uploadingFile, removeFromEdit, downLoadOneFile, editPrepare, removePrepare, createFile } from '../../redux/actions/user'
import { updatePrepared, removeNewDoc, updateDocName } from '../../redux/actions/business';
import { openFile } from '../../services/openfile'
import Sentry from '../../services/sentry';

import Layout from '../../constants/Layout';
import Folder from '../../constants/Folder';
import Colors from '../../constants/Colors';
import Tables from '../../constants/Tables';

import rootDir from '../../services/rootDir';

const { width } = Dimensions.get('window');

import { DocumentWrapper, File, Title, StyledInput, IconsWrapper, EditIcons, Icons } from './Document.styled'

const Document = React.memo((props) => {
  const { name, navigation, type, ID, Extension, Dossier1, Dossier2, Dossier3, Reviewed, Locked, userId, loadingBusiness, loadingFiles, fileToDownload, uploadingDocs, prep, rea, editedDocs, FileName, Prepared, isNew, modeleDownloaded, isConnected, downloadBusiness, editFile, uploadFile, uploadingFile, removeFromEdit, downLoadOneFile, updatePrepared, editPrepare, removePrepare, removeNewDoc, createFile, updateDocName } = props;
  const [isDownloaded, setIsDownloaded] = useState(true);
  const [localFileName, setlocalFileName] = useState(FileName);

  useEffect(() => {
    checkIfDownloaded()
  }, [])

  const onEdit = async () => {
    const isEdited = editedDocs.filter(e => e.ID === ID).length > 0;
    if (isEdited) {
      await openFile(ID, Extension);
    } else {
      const filePath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`;
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        editFile({ ID, editPath: `${EXTERNAL_PATH}${ID}.${Extension}`, affaire: Dossier1, Extension, Dossier3 }, filePath)
      } else if (!loadingBusiness.includes(Dossier1)) {
        if (modeleDownloaded === 'in progress') {
          Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
        } else {
          if (isConnected) {
            downloadBusiness(userId, Dossier1, prep, rea)
          } else {
            Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [{ text: 'Ok' }]);
          }
        }
      }
    }
  }

  const confirmedOnUpload = async () => {
    const filePath = `${EXTERNAL_PATH}${ID}.${Extension}`;
    const destPath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`;
    const file = pick(props, Tables.docField);
    const userName = name;
    const now = new Date();
    const date = `${now.getFullYear()}-${(now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 })}-${now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })}`
    const fileToUpLoad = {
      ...file,
      UpLoadedOn: date,
      UpdatedOn: date,
      UpdatedBy: userName,
      UpLoadedBy: userName
    }
    const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${ID}(0).${Extension}`);
    if (secondVersion) {
      await RNFS.copyFile(`${EXTERNAL_PATH}${ID}(0).${Extension}`, `${EXTERNAL_PATH}${ID}.${Extension}`);
      await RNFS.unlink(`${EXTERNAL_PATH}${ID}(0).${Extension}`)
    }
    await RNFS.copyFile(filePath, destPath);
    uploadingFile(ID);
    if (isNew) {
      return createFile(destPath, fileToUpLoad)
    } else {
      return uploadFile(destPath, fileToUpLoad);
    }
  }

  const onUpload = () => {
    if (isConnected) {
      if (Prepared === 'O') {
        Alert.alert("Confirmer l'envoi", "Etes-vous sûr de vouloir envoyer ce fichier ?", [{
          text: 'Annuler',
          style: 'cancel',
        }, {
          text: 'Oui',
          onPress: () => confirmedOnUpload()
        }]);
      } else {
        Alert.alert('Envoi impossible', "Le fichier n'est pas coché comme 'Préparé'", [{ text: 'Ok' }]);
      }
    } else {
      Alert.alert('Connexion impossible', 'Vous pourrez envoyer votre fichier une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  const confirmedOnPrepare = (newPrepared, now) => {
    const PreparedOn = now.getFullYear() + '-' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '-' + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
    const Revisable = 'O';
    updatePrepared(ID, newPrepared, PreparedOn, name, Revisable);
    editPrepare({ ID, Prepared: true, affaire: Dossier1, Extension: Extension, Dossier3: Dossier3 })
  }

  const onPrepare = () => {
    const newPrepared = Prepared === 'O' ? 'N' : 'O';
    const now = new Date();
    if (newPrepared === 'N') {
      const PreparedOn = '1900-01-01';
      const Revisable = 'N';
      const PreparedBy = '';
      updatePrepared(ID, newPrepared, PreparedOn, PreparedBy, Revisable);
      removePrepare(ID)
    } else {
      Alert.alert("Confirmer la préparation", "Etes-vous sûr de vouloir cocher ce fichier comme préparé ?", [{
        text: 'Annuler',
        style: 'cancel',
      }, {
        text: 'Oui',
        onPress: () => confirmedOnPrepare(newPrepared, now)
      }]);
    }
  }

  const removeFile = async () => {
    if (!isNew) {
      const doc = editedDocs.filter(e => e.ID === ID)[0]
      if (doc.Prepared) {
        updatePrepared(ID, 'N', '1900-01-01', '');
      }
      removeFromEdit(ID);
    } else {
      removeNewDoc(ID);
      removeFromEdit(ID);
      const LocalPath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`
      await RNFS.unlink(LocalPath)
      const externalPath = `${EXTERNAL_PATH}${ID}.${Extension}`;
      try {
        await RNFS.unlink(externalPath)
      } catch (error) {
        Sentry.captureException(error, { func: 'removeWoPFile', doc: 'Document.js' })
        return;
      }
    }
  }

  const onCancel = () => {
    Alert.alert(
      'Etes-vous sûr de vouloir annuler les modifications ?',
      'Les modifications seront perdues définitivement',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: removeFile },
      ],
    )
  }

  const onDownloadFile = () => {
    if (isConnected) {
      downLoadOneFile(ID, Extension, Dossier1)
      return ToastAndroid.showWithGravity(
        "Fichier en cours de téléchargement",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      return Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  const onOpenFile = async () => {
    const isEdited = editedDocs.filter(e => e.ID === ID && !!e.editPath).length > 0;
    const isPrepared = editedDocs.filter(e => e.ID === ID && e.Prepared).length > 0;
    const isDownloaded = await RNFS.exists(`${rootDir}/${userId}/${Dossier1}/${Dossier2}/${ID}.${Extension}`)
    if (isDownloaded) {
      const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${ID}(0).${Extension}`);
      if (secondVersion && isEdited) {
        RNFS.copyFile(`${EXTERNAL_PATH}${ID}(0).${Extension}`, `${EXTERNAL_PATH}${ID}.${Extension}`)
          .then(() => RNFS.unlink(`${EXTERNAL_PATH}${ID}(0).${Extension}`)
            .then(() =>
              navigation.navigate('Pdf', { title: FileName, ID, Dossier3, Extension, Dossier1, type, isEdited, Prepared, Reviewed, isPrepared, Locked })
            )
          )
          .catch((e) => {
            Sentry.captureException(e, { func: 'onOpenFile', doc: 'Document.js' })
            return;
          })
      } else {
        return navigation.navigate('Pdf', { title: FileName, ID, Dossier3, Extension, Dossier1, type, isEdited, Prepared, Reviewed, isPrepared, Locked })
      }
    }
    if (!loadingBusiness.includes(Dossier1)) {
      if (modeleDownloaded === 'in progress') {
        return Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
      } else {
        onDownloadFile();
      }
    }
    return ToastAndroid.showWithGravity(
      "Affaire en cours de téléchargement",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );

  }

  const checkIfDownloaded = async () => {
    const filepath = `${rootDir}/${userId}/${Dossier1}/${Dossier2}/${ID}.${Extension}`
    const downloaded = await RNFS.exists(filepath)
    if (isDownloaded !== downloaded) setIsDownloaded(downloaded)
  }

  const displayLeftIcon = () => {
    if (!isDownloaded || fileToDownload.includes(ID)) {
      return (
        loadingFiles.includes(ID) ?
          <ActivityIndicator style={{ paddingLeft: 10, paddingRight: 10 }} />
          :
          <Icons
            name={'md-cloud-download'}
            size={Layout.icon.small}
            color={Colors.secondColor}
            onPress={onDownloadFile}
          />
      )
    }
    return undefined;
  }

  const isEdited = editedDocs.filter(e => e.ID === ID).length > 0;
  return (
    <DocumentWrapper
      onPress={onOpenFile}
    >
      <File>
        {displayLeftIcon()}
        {isNew ?
          <StyledInput
            width={width}
            allowFontScaling
            onChangeText={(name) => setlocalFileName(name)}
            placeholder="Nom du fichier"
            value={localFileName}
            editable={Prepared === 'N'}
            onEndEditing={() => updateDocName(localFileName, ID)}
          /> :
          <Title width={width}>{FileName}</Title>}
      </File>
      {type === Folder.rea ?
        <IconsWrapper>
          {isEdited && (
            <EditIcons>
              <Icons
                name="md-close"
                size={Layout.icon.default}
                color="red"
                onPress={onCancel}
              />
              {!uploadingDocs.includes(ID) ?
                <Icons
                  name="md-cloud-upload"
                  size={Layout.icon.default}
                  color={Colors.secondColor}
                  onPress={onUpload}
                /> : <ActivityIndicator style={{ paddingLeft: 5, paddingRight: 5 }} />}
              <Icons
                name="md-checkbox-outline"
                size={Layout.icon.default}
                color={Prepared === 'O' ? "green" : Colors.thirdColor}
                onPress={Locked === 'O' || (Prepared === 'O' && !isEdited) ? () => { } : onPrepare}
              />
            </EditIcons>
          )}
          {Locked === 'O' ?
            <Icons
              name="md-lock"
              size={Layout.icon.default}
            /> : (Reviewed === 'O' || (Prepared === 'O' && !isEdited)) ?
              <Icons
                name="md-checkbox-outline"
                size={Layout.icon.default}
                color={"green"}
                onPress={() => { }}
              /> :
              <Icons
                name="md-create"
                size={Layout.icon.default}
                onPress={onEdit}
              />}
        </IconsWrapper> :
        <IconsWrapper>
          <Icons
            name="md-lock"
            size={Layout.icon.default}
          />
        </IconsWrapper>
      }
    </DocumentWrapper>
  );

})

Document.propTypes = {
  FileName: PropTypes.string.isRequired,
  ID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  Dossier3: PropTypes.string.isRequired,
  Extension: PropTypes.string.isRequired,
  Dossier1: PropTypes.string.isRequired,
  ServerPath: PropTypes.string.isRequired,
  type: PropTypes.string,
  navigation: PropTypes.object.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  downloadBusiness: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  prep: PropTypes.array.isRequired,
  rea: PropTypes.array.isRequired,
  modeleDocs: PropTypes.array.isRequired,
  editFile: PropTypes.func.isRequired,
  editedDocs: PropTypes.array.isRequired,
  uploadingDocs: PropTypes.array.isRequired,
  uploadingFile: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  removeFromEdit: PropTypes.func.isRequired,
  downLoadOneFile: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
  Dossier2: PropTypes.string.isRequired,
  fileToDownload: PropTypes.array.isRequired,
  loadingFiles: PropTypes.array.isRequired,
  Reviewed: PropTypes.string.isRequired,
  Prepared: PropTypes.string.isRequired,
  Locked: PropTypes.string.isRequired,
  isConnected: PropTypes.bool.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  updatePrepared: PropTypes.func.isRequired,
  removeNewDoc: PropTypes.func.isRequired,
  editPrepare: PropTypes.func.isRequired,
  removePrepare: PropTypes.func.isRequired,
  createFile: PropTypes.func.isRequired,
  updateDocName: PropTypes.func.isRequired,
};

Document.defaultProps = {
  type: Folder.prep,
  isNew: false,
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  loadingBusiness: state.user.loadingBusiness,
  editedDocs: state.user.editedDocs,
  uploadingDocs: state.user.uploadingDocs,
  fileToDownload: state.user.fileToDownload,
  loadingFiles: state.user.loadingFiles,
  userId: state.user.userId,
  name: state.user.name,
  modeleDocs: state.business.modeles,
  modeleDownloaded: state.user.modeleDownloaded,
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness, editFile, uploadFile, uploadingFile, removeFromEdit, downLoadOneFile, updatePrepared, editPrepare, removePrepare, removeNewDoc, createFile, updateDocName })(Document));
