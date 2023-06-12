import React, { useState } from 'react';
import RNFS from 'react-native-fs';
import PropTypes from 'prop-types';
import pick from 'lodash.pick';
import { EXTERNAL_PATH } from 'react-native-dotenv';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SectionDocs from './SectionDocs';
import { uploadingFile, uploadMultipleFiles, uploadingMulti } from '../../redux/actions/user';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Folder from '../../constants/Folder';
import Tables from '../../constants/Tables';

import rootDir from '../../services/rootDir';

import BusinessIcons from './BusinessIcons';

import { BusinessWrapper, MainSection, Title } from './BusinessWithDocs.styled';

const SysDocs = React.memo((props) => {
  const {
    userId,
    id,
    name,
    isConnected,
    designation,
    sysDoc,
    editedDocs,
    uploadingDocs,
    multipleUploadDocs,
    newDocs,
    docs,
    uploadingFile,
    uploadMultipleFiles,
    uploadingMulti,
  } = props;
  const [upLoading, setupLoading] = useState(false);

  const confirmedOnUpload = async () => {
    const editedBusiness = editedDocs.filter((e) => e.affaire === id);
    setupLoading(true);
    const filesToUpload = [];
    const multiUpload = [];
    for (let i = 0; i < editedBusiness.length; i++) {
      const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${editedBusiness[i].ID}(0).${editedBusiness[i].Extension}`);
      if (secondVersion) {
        await RNFS.copyFile(
          `${EXTERNAL_PATH}${editedBusiness[i].ID}(0).${editedBusiness[i].Extension}`,
          `${EXTERNAL_PATH}${editedBusiness[i].ID}.${editedBusiness[i].Extension}`
        );
        await RNFS.unlink(`${EXTERNAL_PATH}${editedBusiness[i].ID}(0).${editedBusiness[i].Extension}`);
      }
      const filePath = `${EXTERNAL_PATH}${editedBusiness[i].ID}.${editedBusiness[i].Extension}`;
      const destPath = `${rootDir}/${userId}/${id}/${Folder.rea}/${editedBusiness[i].ID}.${editedBusiness[i].Extension}`;
      let file = {};
      if (editedBusiness[i].isNew) {
        file = { ...newDocs.filter((n) => n.ID === editedBusiness[i].ID)[0] };
      } else {
        file = { ...docs.filter((n) => n && n.ID === editedBusiness[i].ID)[0] };
      }
      multiUpload.push({ affaire: id, fileId: editedBusiness[i].ID });
      pick(props, Tables.docField);
      await RNFS.copyFile(filePath, destPath);
      const remoteDir = `./${id}/Realisation/${editedBusiness[i].Dossier3}`;
      const userName = name;
      const now = new Date();
      const date = `${now.getFullYear()}-${(now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 })}-${now
        .getDate()
        .toLocaleString('fr-FR', { minimumIntegerDigits: 2 })}`;
      const fileToUpLoad = {
        ...file,
        UpLoadedOn: date,
        UpdatedOn: date,
        UpdatedBy: userName,
        UpLoadedBy: userName,
      };
      uploadingFile(editedBusiness[i].ID);
      if (editedBusiness[i].isNew) {
        filesToUpload.push({
          ...fileToUpLoad,
          filePath: destPath,
          remoteDir,
          isNew: true,
        });
      } else {
        filesToUpload.push({
          ...fileToUpLoad,
          filePath: destPath,
          remoteDir,
          isNew: false,
        });
      }
    }
    uploadingMulti(multiUpload);
    uploadMultipleFiles(filesToUpload);
    setupLoading(false);
  };

  const onUpload = () => {
    if (isConnected) {
      if (uploadingDocs.length > 0) {
        Alert.alert('Envoi en cours', "Vous pourrez envoyer vos fichiers une fois l'envoi terminé", [{ text: 'Ok' }]);
      } else {
        const editedBusiness = editedDocs.filter((e) => e.affaire === id);
        const unPreparedDocs = editedBusiness.filter((d) => !(d.Prepared && d.Prepared === true));
        if (unPreparedDocs.length > 0) {
          Alert.alert('Envoi impossible', "Les fichiers ne sont pas tous cochés comme 'Préparé'", [{ text: 'Ok' }]);
        } else {
          Alert.alert("Confirmer l'envoi", "Etes-vous sûr de vouloir envoyer l'ensemble des fichiers modifiés de cette affaire ?", [
            {
              text: 'Annuler',
              style: 'cancel',
            },
            {
              text: 'Oui',
              onPress: () => confirmedOnUpload(),
            },
          ]);
        }
      }
    } else {
      Alert.alert('Connexion impossible', 'Vous pourrez envoyer votre fichier une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  };

  const displayIcon = () => {
    const editedBusiness = editedDocs.filter((e) => e.affaire === id);
    if (upLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    } else if (multipleUploadDocs.length > 0) {
      return (
        <View style={{ alignItems: 'center' }}>
          <Text>{multipleUploadDocs.length}</Text>
          <ActivityIndicator />
        </View>
      );
    } else if (editedBusiness.length > 0) {
      return <Ionicons name={'md-cloud-upload'} size={Layout.icon.large} color={Colors.secondColor} onPress={onUpload} />;
    }
    return null;
  };

  return (
    <BusinessWrapper>
      <MainSection>
        <Title>{designation}</Title>
        <BusinessIcons id={id} sysDoc={sysDoc} hideNav />
        {displayIcon()}
      </MainSection>
      <SectionDocs key={Folder.sysDoc} id={id} docs={{ prep: [], rea: [], sysDoc }} type={Folder.sysDoc} />
    </BusinessWrapper>
  );
});

SysDocs.propTypes = {
  id: PropTypes.string.isRequired,
  client: PropTypes.string.isRequired,
  designation: PropTypes.string.isRequired,
  sysDoc: PropTypes.array,
  modeleDocs: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  isConnected: PropTypes.bool.isRequired,
  editedDocs: PropTypes.array.isRequired,
  uploadingFile: PropTypes.func.isRequired,
  uploadingDocs: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  multipleUploadDocs: PropTypes.array,
  uploadingMulti: PropTypes.func.isRequired,
  uploadMultipleFiles: PropTypes.func.isRequired,
  docs: PropTypes.array,
  newDocs: PropTypes.array,
  isSimplified: PropTypes.string,
};

SysDocs.defaultProps = {
  sysDoc: [],
  multipleUploadDocs: [],
  docs: [],
  newDocs: [],
};

const mapStateToProps = (state, props) => ({
  isConnected: state.network.isConnected,
  uploadingDocs: state.user.uploadingDocs,
  userId: state.user.userId,
  name: state.user.name,
  editedDocs: state.user.editedDocs,
  modeleDocs: state.business.modeles,
  multipleUploadDocs: state.user.multipleUploadDocs.filter((m) => m.affaire === props.title),
  docs: state.business.docs,
  newDocs: state.business.newDocs,
});

export default connect(mapStateToProps, { uploadingFile, uploadMultipleFiles, uploadingMulti })(SysDocs);
