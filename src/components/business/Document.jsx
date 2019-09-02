import React from 'react';
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

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDownloaded: true,
      localFileName: props.fileName
    }
  }

  onEdit = async () => {
    const { type, id, extension, dossier1, userId, loadingBusiness, prep, rea, editedDocs, dossier3 } = this.props;
    const isEdited = editedDocs.filter(e => e.id === id).length > 0;
    if (isEdited) {
      await openFile(id, extension);
    } else {
      const filePath = `${rootDir}/${userId}/${dossier1}/${type}/${id}.${extension}`;
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        this.props.editFile({ id, editPath: `${EXTERNAL_PATH}${id}.${extension}`, affaire: dossier1, extension, dossier3 }, filePath)
      } else if (!loadingBusiness.includes(dossier1)) {
        if (this.props.modeleDownloaded === 'in progress') {
          Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
        } else {
          if (this.props.isConnected) {
            this.props.downloadBusiness(userId, dossier1, prep, rea)
          } else {
            Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [{ text: 'Ok' }]);
          }
        }
      }
    }
  }

  confirmedOnUpload = async () => {
    const { id, extension, isNew, userId, dossier1, type } = this.props;
    const filePath = `${EXTERNAL_PATH}${id}.${extension}`;
    const destPath = `${rootDir}/${userId}/${dossier1}/${type}/${id}.${extension}`;
    const file = pick(this.props, Tables.docField);
    const userName = this.props.name;
    const now = new Date();
    const date = now.getFullYear() + '-' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '-' + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
    const fileToUpLoad = {
      ...file,
      upLoadedOn: date,
      updatedOn: date,
      updatedBy: userName,
      upLoadedBy: userName
    }
    const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${id}(0).${extension}`);
    if (secondVersion) {
      await RNFS.copyFile(`${EXTERNAL_PATH}${id}(0).${extension}`, `${EXTERNAL_PATH}${id}.${extension}`);
      await RNFS.unlink(`${EXTERNAL_PATH}${id}(0).${extension}`)
    }
    await RNFS.copyFile(filePath, destPath);
    this.props.uploadingFile(id);
    if (isNew) {
      return this.props.createFile(filePath, fileToUpLoad)
    } else {
      return this.props.uploadFile(filePath, fileToUpLoad);
    }
  }

  onUpload = () => {
    const { isConnected, prepared } = this.props;
    if (isConnected) {
      if (prepared === 'O') {
        Alert.alert("Confirmer l'envoi", "Etes-vous sûr de vouloir envoyer ce fichier ?", [{
          text: 'Annuler',
          style: 'cancel',
        }, {
          text: 'Oui',
          onPress: () => this.confirmedOnUpload()
        }]);
      } else {
        Alert.alert('Envoi impossible', "Le fichier n'est pas coché comme 'Préparé'", [{ text: 'Ok' }]);
      }
    } else {
      Alert.alert('Connexion impossible', 'Vous pourrez envoyer votre fichier une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  confirmedOnPrepare = (newPrepared, now) => {
    const PreparedOn = now.getFullYear() + '-' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '-' + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
    const Revisable = 'O';
    this.props.updatePrepared(this.props.id, newPrepared, PreparedOn, this.props.name, Revisable);
    this.props.editPrepare({ id: this.props.id, prepared: true, affaire: this.props.dossier1, extension: this.props.extension, dossier3: this.props.dossier3 })
  }

  onPrepare = () => {
    const newPrepared = this.props.prepared === 'O' ? 'N' : 'O';
    const now = new Date();
    if (newPrepared === 'N') {
      const PreparedOn = '1900-01-01';
      const Revisable = 'N';
      const PreparedBy = '';
      this.props.updatePrepared(this.props.id, newPrepared, PreparedOn, PreparedBy, Revisable);
      this.props.removePrepare(this.props.id)
    } else {
      Alert.alert("Confirmer la préparation", "Etes-vous sûr de vouloir cocher ce fichier comme préparé ?", [{
        text: 'Annuler',
        style: 'cancel',
      }, {
        text: 'Oui',
        onPress: () => this.confirmedOnPrepare(newPrepared, now)
      }]);
    }
  }

  onCancel = () => {
    Alert.alert(
      'Etes-vous sûr de vouloir annuler les modifications ?',
      'Les modifications seront perdues définitivement',
      [
        { text: 'Annuler', style: 'cancel'},
        { text: 'Oui', onPress: this.removeFile },
      ],
    )
  }

  removeFile = async () => {
    const { id, isNew, userId, dossier1, extension, type } = this.props;
    if (!isNew) {
      const doc = this.props.editedDocs.filter(e => e.id === id)[0]
      if (doc.prepared) {
        this.props.updatePrepared(id, 'N', '1900-01-01', '');
      }
      this.props.removeFromEdit(id);
    } else {
      this.props.removeNewDoc(id);
      this.props.removeFromEdit(id);
      const localPath= `${rootDir}/${userId}/${dossier1}/${type}/${id}.${extension}`
      await RNFS.unlink(localPath)
      const externalPath = `${EXTERNAL_PATH}${id}.${extension}`;
      try {
        await RNFS.unlink(externalPath)
      } catch (error) {
        Sentry.captureException(error, { func: 'removeWoPFile', doc: 'Document.js' })
        return;
      }
    }
  }

  onOpenFile = async () => {
    const { fileName, type, navigation, id, dossier3, extension, dossier1, dossier2, userId, loadingBusiness, editedDocs, prepared, reviewed, locked} = this.props;
    const isEdited = editedDocs.filter(e => e.id === id && !!e.editPath).length > 0;
    const isPrepared = editedDocs.filter(e => e.id === id && e.prepared).length > 0;
    const isDownloaded = await RNFS.exists(`${rootDir}/${userId}/${dossier1}/${dossier2}/${id}.${extension}`)
    if (isDownloaded) {
      const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${id}(0).${extension}`);
      if (secondVersion && isEdited) {
        RNFS.copyFile(`${EXTERNAL_PATH}${id}(0).${extension}`, `${EXTERNAL_PATH}${id}.${extension}`)
          .then(() => RNFS.unlink(`${EXTERNAL_PATH}${id}(0).${extension}`)
            .then(() => 
              navigation.navigate('Pdf', { title: fileName, id, dossier3, extension, dossier1, type, isEdited, prepared, reviewed, isPrepared, locked })
            )
          )
          .catch((e) => {
            Sentry.captureException(e, { func: 'onOpenFile', doc: 'Document.js'})
            return;
          })
      } else {
        return navigation.navigate('Pdf', { title: fileName, id, dossier3, extension, dossier1, type, isEdited, prepared, reviewed, isPrepared, locked })
      } 
    }
    if (!loadingBusiness.includes(dossier1)) {
      if (this.props.modeleDownloaded === 'in progress') {
        return Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
      } else {
        this.onDownloadFile();
      }
    }
    return ToastAndroid.showWithGravity(
      "Affaire en cours de téléchargement",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    
  }

  onDownloadFile = () => {
    const { id, dossier1, extension } = this.props;
    if (this.props.isConnected) {
      this.props.downLoadOneFile(id, extension, dossier1)
      return ToastAndroid.showWithGravity(
        "Fichier en cours de téléchargement",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      return Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  checkIfDownloaded = async () => {
    const { id, extension, dossier1, dossier2, userId } = this.props;
    const filepath = `${rootDir}/${userId}/${dossier1}/${dossier2}/${id}.${extension}`
    const isDownloaded = await RNFS.exists(filepath)
    if (isDownloaded !== this.state.isDownloaded) this.setState({ isDownloaded })
  }

  displayLeftIcon = () => {
    const { id, loadingFiles } = this.props;
    const isDownloaded = this.state.isDownloaded
    if (!isDownloaded || this.props.fileToDownload.includes(id)) {
      return (
        loadingFiles.includes(id) ? 
          <ActivityIndicator style={{ paddingLeft: 10, paddingRight: 10 }} />
        :
          <Icons
            name={'md-cloud-download'}
            size={Layout.icon.small}
            color={Colors.secondColor}
            onPress={this.onDownloadFile}
          />
      )
    }
    return undefined;
  }

  render() {
    this.checkIfDownloaded();
    const { fileName, type, id, editedDocs, uploadingDocs, reviewed, prepared, locked, isNew } = this.props;
    const isEdited = editedDocs.filter(e => e.id === id).length > 0;
    return (
      <DocumentWrapper
        onPress={this.onOpenFile}
      > 
        <File>
          {this.displayLeftIcon()}
          {isNew ?
            <StyledInput
              width={width}
              allowFontScaling
              onChangeText={(localFileName) => this.setState({ localFileName })}
              placeholder="Nom du fichier"
              value={this.state.localFileName}
              editable={prepared === 'N'}
              onEndEditing={() => this.props.updateDocName(this.state.localFileName, id)}
            /> :
            <Title width={width}>{fileName}</Title>}
        </File>
        {type === Folder.rea ? 
          <IconsWrapper>
            {isEdited && (
              <EditIcons>
                <Icons
                  name="md-close"
                  size={Layout.icon.default}
                  color="red"
                  onPress={this.onCancel}
                />
                {!uploadingDocs.includes(id) ?
                <Icons
                  name="md-cloud-upload"
                  size={Layout.icon.default}
                  color={Colors.secondColor}
                  onPress={this.onUpload}
                /> : <ActivityIndicator style={{ paddingLeft: 5, paddingRight: 5 }}/>}
                <Icons
                  name="md-checkbox-outline"
                  size={Layout.icon.default}
                  color={prepared === 'O' ? "green" : Colors.thirdColor}
                  onPress={locked === 'O' || (prepared === 'O' && !isEdited) ? () => { } : this.onPrepare}
                />
              </EditIcons>
            )}
            {locked === 'O' ? 
            <Icons
              name="md-lock"
              size={Layout.icon.default}
            /> : (reviewed === 'O' || (prepared === 'O' && !isEdited)) ? 
              <Icons
                name="md-checkbox-outline"
                size={Layout.icon.default}
                color={"green"}
                onPress={() => { }}
              /> :
            <Icons
              name="md-create"
              size={Layout.icon.default}
              onPress={this.onEdit}
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
  } 
}

Document.propTypes = {
  fileName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  dossier3: PropTypes.string.isRequired,
  extension: PropTypes.string.isRequired,
  dossier1: PropTypes.string.isRequired,
  serverPath: PropTypes.string.isRequired,
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
  dossier2: PropTypes.string.isRequired,
  fileToDownload: PropTypes.array.isRequired,
  loadingFiles: PropTypes.array.isRequired,
  reviewed: PropTypes.string.isRequired,
  prepared: PropTypes.string.isRequired,
  locked: PropTypes.string.isRequired,
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
  userId: state.user.id,
  name: state.user.name,
  modeleDocs: state.business.modeles,
  modeleDownloaded: state.user.modeleDownloaded,
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness, editFile, uploadFile, uploadingFile, removeFromEdit, downLoadOneFile, updatePrepared, editPrepare, removePrepare, removeNewDoc, createFile, updateDocName })(Document));