import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableOpacity, Text, View, ActivityIndicator, Dimensions, Alert, ToastAndroid } from 'react-native';
import pick from 'lodash.pick';
import RNFS from 'react-native-fs';
import { EXTERNAL_PATH } from 'react-native-dotenv';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNavigation } from 'react-navigation';
import { downloadBusiness, editFile, uploadFile, uploadingFile, removeFromEdit, downLoadOneFile, editPrepare, removePrepare, createFile } from '../../redux/actions/user'
import { updatePrepared, removeNewDoc } from '../../redux/actions/business';
import { openFile } from '../../services/openfile'

import Layout from '../../constants/Layout';
import Folder from '../../constants/Folder';
import Colors from '../../constants/Colors';
import Tables from '../../constants/Tables';

const rootDir = RNFS.DocumentDirectoryPath;
const { width } = Dimensions.get('window');

const DocumentWrapper = styled(TouchableOpacity)`
  margin: ${Layout.space.medium};
  flex-direction: row;
  justify-content: space-between;
`;

const File = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Title = styled(Text)`
  font-size: ${Layout.font.medium};
  max-width: ${width/2}px;
`;

const IconsWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const EditIcons = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Icons = styled(Ionicons)`
  padding: 0 5px;
`;

class Document extends React.Component {
  onEdit = async () => {
    const { type, ID, Extension, Dossier1, userId, loadingBusiness, prep, rea, editedDocs } = this.props;
    const isEdited = editedDocs.filter(e => e.ID === ID).length > 0;
    if (isEdited) {
      await openFile(ID, Extension);
    } else {
      const filePath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`;
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        this.props.editFile({ ID, editPath: `${EXTERNAL_PATH}${ID}.${Extension}`}, filePath)
      } else if (!loadingBusiness.includes(Dossier1)) {
        if (this.props.modeleDownloaded === 'in progress') {
          Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
        } else {
          if (this.props.isConnected) {
            this.props.downloadBusiness(userId, Dossier1, prep, rea)
          } else {
            Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [{ text: 'Ok' }]);
          }
        }
      }
    }
  }

  onUpload = async () => {
    const { ID, Extension, isNew, userId, Dossier1, Dossier3, type, isConnected, mssqlConnected } = this.props;
    if (isConnected && mssqlConnected) {
      const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${ID}(0).${Extension}`);
      if (secondVersion) {
        await RNFS.copyFile(`${EXTERNAL_PATH}${ID}(0).${Extension}`, `${EXTERNAL_PATH}${ID}.${Extension}`);
        await RNFS.unlink(`${EXTERNAL_PATH}${ID}(0).${Extension}`)
      }
      const filePath = `${EXTERNAL_PATH}${ID}.${Extension}`;
      const destPath = `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`;
      const file = pick(this.props, Tables.docField);
      await RNFS.copyFile(filePath, destPath);
      const remoteDir = `./${Dossier1}/Realisation${Dossier3 !== '' ? `/${Dossier3}` : ''}`
      const userName = this.props.name;
      const now = new Date();
      const date = now.getFullYear() + '-' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '-' + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
      const fileToUpLoad = {
        ...file,
        UpLoadedOn: date,
        UpdatedOn: date,
        UpdatedBy: userName,
        UpLoadedBy: userName
      }
      this.props.uploadingFile(ID);
      if (isNew) {
        return this.props.createFile(filePath, fileToUpLoad, remoteDir)
      } else {
        return this.props.uploadFile(filePath, fileToUpLoad, remoteDir);
      }
    } else {
      Alert.alert('Connexion impossible', 'Vous pourrez envoyer votre fichier une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  onPrepare = () => {
    const newPrepared = this.props.Prepared === 'O' ? 'N' : 'O';
    const now = new Date();
    if (newPrepared === 'N') {
      const PreparedOn = '1900-01-01';
      this.props.updatePrepared(this.props.ID, newPrepared, PreparedOn);
      this.props.removePrepare(this.props.ID)
    } else {
      const PreparedOn = now.getFullYear() + '-' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '-' + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
      this.props.updatePrepared(this.props.ID, newPrepared, PreparedOn);
      this.props.editPrepare({ID: this.props.ID, prepared: true})
    }
  }

  onCancel = () => {
    Alert.alert(
      'Etes-vous sûr de vouloir annuler les modifications ?',
      'Les modifications seront perdues définitivement',
      [
        { text: 'Annuler'},
        { text: 'Oui', onPress: this.removeFile },
      ],
    )
  }

  removeFile = async () => {
    const { ID, isNew, userId, Dossier1, Extension, type } = this.props;
    if (!isNew) {
      const doc = this.props.editedDocs.filter(e => e.ID === ID)[0]
      if (doc.prepared) {
        this.props.updatePrepared(ID, 'N', '1900-01-01');
      }
      this.props.removeFromEdit(ID);
    } else {
      this.props.removeNewDoc(ID)
      const localPath= `${rootDir}/${userId}/${Dossier1}/${type}/${ID}.${Extension}`
      await RNFS.unlink(localPath)
      const externalPath = `${EXTERNAL_PATH}${ID}.${Extension}`;
      try {
        await RNFS.unlink(externalPath)
      } catch (error) {
        console.log({removeWoPFile: error })
      }
    }
  }

  onOpenFile = async () => {
    const { FileName, type, navigation, ID, Dossier3, Extension, Dossier1, isDownloaded, userId, prep, rea, loadingBusiness, editedDocs, Prepared, Reviewed} = this.props;
    const isEdited = editedDocs.filter(e => e.ID === ID && !!e.editPath).length > 0;
    const isPrepared = editedDocs.filter(e => e.ID === ID && e.prepared).length > 0;
    if (isDownloaded) {
      const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${ID}(0).${Extension}`);
      if (secondVersion && isEdited) {
        RNFS.copyFile(`${EXTERNAL_PATH}${ID}(0).${Extension}`, `${EXTERNAL_PATH}${ID}.${Extension}`)
          .then(() => RNFS.unlink(`${EXTERNAL_PATH}${ID}(0).${Extension}`)
            .then(() => 
              navigation.navigate('Pdf', { title: FileName, ID, Dossier3, Extension, Dossier1, type, isEdited, Prepared, Reviewed, isPrepared })
            )
          )
          .catch((e) => console.log({e}))
      } else {
        return navigation.navigate('Pdf', { title: FileName, ID, Dossier3, Extension, Dossier1, type, isEdited, Prepared, Reviewed, isPrepared })
      } 
    }
    if (!loadingBusiness.includes(Dossier1)) {
      if (this.props.modeleDownloaded === 'in progress') {
        return Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
      } else {
        if (this.props.isConnected) {
          this.props.downloadBusiness(userId, Dossier1, prep, rea)
          return ToastAndroid.showWithGravity(
            "Affaire en cours de téléchargement",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        } else {
          Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [{ text: 'Ok' }]);
        }
      }
    }
    return ToastAndroid.showWithGravity(
      "Affaire en cours de téléchargement",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    
  }

  render() {
    const { FileName, type, ID, Extension, editedDocs, uploadingDocs, Reviewed, Prepared } = this.props;
    const isEdited = editedDocs.filter(e => e.ID === ID).length > 0;
    return (
      <DocumentWrapper
        onPress={this.onOpenFile}
      > 
        <File>
          <Icons
            name={['png', 'jpg'].includes(Extension) ? 'md-image' : 'md-document'}
            size={Layout.icon.small}
          />
          <Title>{FileName}</Title>
        </File>
        {type === Folder.rea && 
          <IconsWrapper>
            {isEdited && (
              <EditIcons>
                <Icons
                  name="md-close"
                  size={Layout.icon.default}
                  color="red"
                  onPress={this.onCancel}
                />
                {!uploadingDocs.includes(ID) ?
                <Icons
                  name="md-cloud-upload"
                  size={Layout.icon.default}
                  color={Colors.secondColor}
                  onPress={this.onUpload}
                /> : <ActivityIndicator style={{ paddingLeft: 10, paddingRight: 10 }}/>}
              </EditIcons>
            )}
            <Icons
              name="md-checkbox-outline"
              size={Layout.icon.default}
              color={Prepared === 'O' ? "green" : Colors.thirdColor}
              onPress={(Prepared === 'O' && !isEdited) ? () => {} : this.onPrepare}
            />
            {Reviewed === 'O' || (Prepared === 'O' && !isEdited) ? undefined :
            <Icons
              name="md-create"
              size={Layout.icon.default}
              onPress={this.onEdit}
            />}
          </IconsWrapper>
        }
      </DocumentWrapper>
    );
  } 
}

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
  isDownloaded: PropTypes.bool
}

Document.defaultProps = {
  type: Folder.prep,
  isNew: false,
  isDownloaded: false
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  mssqlConnected: state.network.mssqlConnected,
  mssqlConnectionFailed: state.network.mssqlConnectionFailed,
  loadingBusiness: state.user.loadingBusiness,
  editedDocs: state.user.editedDocs,
  uploadingDocs: state.user.uploadingDocs,
  userId: state.user.id,
  name: state.user.name,
  modeleDocs: state.business.docs.filter(d => d.Dossier1 === 'Modele'),
  modeleDownloaded: state.user.modeleDownloaded,
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness, editFile, uploadFile, uploadingFile, removeFromEdit, downLoadOneFile, updatePrepared, editPrepare, removePrepare, removeNewDoc, createFile })(Document));
