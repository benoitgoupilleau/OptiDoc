import React, { useState } from 'react';
import RNFS from 'react-native-fs';
import PropTypes from 'prop-types';
import pick from 'lodash.pick';
import { EXTERNAL_PATH } from 'react-native-dotenv';
import { connect } from 'react-redux';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Document from './Document'
import SubArbo from './SubArbo';
import { uploadingFile, uploadMultipleFiles, uploadingMulti } from '../../redux/actions/user'

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout'
import Folder from '../../constants/Folder'
import Tables from '../../constants/Tables';

import rootDir from '../../services/rootDir';

import { BusinessWrapper, MainSection, Title, SectionWrapper, Section, IconView, Icons, AddIcons } from './BusinessWithDocs.styled';

const checkIfNew = (docs, id) => {
  const doc = docs.filter(d => d.id === id)
  if (doc.length > 0 && !!doc[0].isNew) {
    return true;
  } 
  return false;
}

const BusinessWithDocs = React.memo((props) => {
  const { userId, id, navigation, isConnected, client, designation, prep, rea, editedDocs, uploadingDocs, multipleUploadDocs, newDocs, docs, uploadingFile, subFolder, uploadMultipleFiles, uploadingMulti } = props;
  const [showPrep, setshowPrep] = useState(false);
  const [showRea, setshowRea] = useState(false);
  const [upLoading, setupLoading] = useState(false);

  const confirmedOnUpload = async () => {
    const editedBusiness = editedDocs.filter(e => e.affaire === id)
    setupLoading(true);
    const filesToUpload = [];
    const multiUpload = [];
    for (let i = 0; i < editedBusiness.length; i++) {
      const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${editedBusiness[i].id}(0).${editedBusiness[i].Extension}`);
      if (secondVersion) {
        await RNFS.copyFile(`${EXTERNAL_PATH}${editedBusiness[i].id}(0).${editedBusiness[i].Extension}`, `${EXTERNAL_PATH}${editedBusiness[i].id}.${editedBusiness[i].Extension}`);
        await RNFS.unlink(`${EXTERNAL_PATH}${editedBusiness[i].id}(0).${editedBusiness[i].Extension}`)
      }
      const filePath = `${EXTERNAL_PATH}${editedBusiness[i].id}.${editedBusiness[i].Extension}`;
      const destPath = `${rootDir}/${userId}/${id}/${Folder.rea}/${editedBusiness[i].id}.${editedBusiness[i].Extension}`;
      let file = {}
      if (editedBusiness[i].isNew) {
        file = { ...newDocs.filter(n => n.id === editedBusiness[i].id)[0] }
      } else {
        file = { ...docs.filter(n => n.id === editedBusiness[i].id)[0] }
      }
      multiUpload.push({ affaire: id, fileId: editedBusiness[i].id });
      pick(props, Tables.docField);
      await RNFS.copyFile(filePath, destPath);
      const remoteDir = `./${id}/Realisation/${editedBusiness[i].Dossier3}`
      const userName = name;
      const now = new Date();
      const date = `${now.getFullYear()}-${(now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 })}-${now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })}`
      const fileToUpLoad = {
        ...file,
        upLoadedOn: date,
        updatedOn: date,
        updatedBy: userName,
        upLoadedBy: userName
      }
      uploadingFile(editedBusiness[i].id);
      if (editedBusiness[i].isNew) {
        filesToUpload.push({ ...fileToUpLoad, filePath, remoteDir, isNew: true })
      } else {
        filesToUpload.push({ ...fileToUpLoad, filePath, remoteDir, isNew: false })
      }
    }
    uploadingMulti(multiUpload)
    uploadMultipleFiles(filesToUpload);
    setupLoading(false);
  }

  const onUpload = () => {
    if (isConnected) {
      if (uploadingDocs.length > 0) {
        Alert.alert('Envoi en cours', "Vous pourrez envoyer vos fichiers une fois l'envoi terminé", [{ text: 'Ok' }]);
      } else {
        const editedBusiness = editedDocs.filter(e => e.affaire === id)
        const unPreparedDocs = editedBusiness.filter(d => !(d.prepared && d.prepared === true))
        if (unPreparedDocs.length > 0) {
          Alert.alert('Envoi impossible', "Les fichiers ne sont pas tous cochés comme 'Préparé'", [{ text: 'Ok' }]);
        } else {
          Alert.alert("Confirmer l'envoi", "Etes-vous sûr de vouloir envoyer l'ensemble des fichiers modifiés de cette affaire ?", [{
            text: 'Annuler',
            style: 'cancel',
          }, {
            text: 'Oui',
            onPress: () => confirmedOnUpload()
          }]);
        }
      }
    } else {
      Alert.alert('Connexion impossible', 'Vous pourrez envoyer votre fichier une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  const displayIcon = () => {
    const editedBusiness = editedDocs.filter(e => e.affaire === id)
    if (upLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>)
    } else if (multipleUploadDocs.length > 0) {
      return (
        <View style={{ alignItems: 'center' }}>
          <Text>{multipleUploadDocs.length}</Text>
          <ActivityIndicator />
        </View>)
    } else if (editedBusiness.length > 0) {
      return (
        <Ionicons
          name={"md-cloud-upload"}
          size={Layout.icon.large}
          color={Colors.secondColor}
          onPress={onUpload}
        />
      )
    }
    return null;
  }

  const toggleRea = () => {
    const toggle = !showRea;
    setshowRea(toggle)
  }

  const togglePrep = () => {
    const toggle = !showPrep
    setshowPrep(toggle);
  }

  const displayPrep = () => {
    const listArbo = [];
    for (let i = 0; i < prep.length; i++) {
      const indexArbo = listArbo.findIndex(a => (a.nomDossier === prep[i].dossier3 && a.etape === 'Preparation'))
      if (indexArbo === -1) {
        const newArbo = subFolder.filter(s => (s.nomDossier === prep[i].dossier3 && s.etape === 'Preparation'))[0]
        listArbo.push(newArbo)
      }
    }
    if (listArbo.length > 0) {
      listArbo.sort((a, b) => (a.nomDossier > b.nomDossier ? 1 : -1));
      return listArbo.map(arbo => <SubArbo key={'Prep' + arbo.nomDossier} title={arbo.designation}>{prep.filter(p => p.dossier3 === arbo.nomDossier)
        .sort((a, b) => (a.fileName > b.fileName ? 1 : -1))
        .map(p => <Document key={p.id} {...p} type={Folder.prep} prep={prep} rea={rea} />)}
      </SubArbo>)
    }
    return <React.Fragment></React.Fragment>
  }

  const displayRea = () => {
    const listArbo = [];
    for (let i = 0; i < rea.length; i++) {
      const indexArbo = listArbo.findIndex(a => (a.nomDossier === rea[i].dossier3 && a.etape === 'Realisation'))
      if (indexArbo === -1) {
        const newArbo = subFolder.filter(s => (s.nomDossier === rea[i].dossier3 && s.etape === 'Realisation'))[0]
        listArbo.push(newArbo)
      }
    }
    if (listArbo.length > 0) {
      listArbo.sort((a, b) => (a.nomDossier > b.nomDossier ? 1 : -1));
      return listArbo.map(arbo => <SubArbo key={'Rea' + arbo.nomDossier} title={arbo.designation}>{rea.filter(r => r.dossier3 === arbo.nomDossier)
        .sort((a, b) => (a.fileName > b.fileName ? 1 : -1))
        .map(r => <Document key={r.id} isNew={checkIfNew(editedDocs, r.id)} {...r} type={Folder.rea} prep={prep} rea={rea} />)}
      </SubArbo>)
    }
    return <React.Fragment></React.Fragment>
  }

  const clientName = `${client} - ${designation}`;
  return (
    <BusinessWrapper>
      <MainSection>
        <Title>{clientName}</Title>
        {displayIcon()}
      </MainSection>
      <SectionWrapper>
        <Icons
          name={showPrep ? "md-arrow-dropdown" : "md-arrow-dropright"}
          size={Layout.icon.default}
          color={Colors.mainColor}
          onPress={togglePrep}
        />
        <Section onPress={togglePrep} >Préparation</Section>
      </SectionWrapper>
      {showPrep && displayPrep()}
      <SectionWrapper>
        <Icons
          name={showRea ? "md-arrow-dropdown" : "md-arrow-dropright"}
          size={Layout.icon.default}
          color={Colors.mainColor}
          onPress={toggleRea}
        />
        <Section onPress={toggleRea} >Réalisation</Section>
        <IconView>
          <AddIcons
            name={"md-camera"}
            size={Layout.icon.large}
            color={Colors.mainColor}
            onPress={() => navigation.navigate('AddPic', { affaire: id })}
          />
          <AddIcons
            name={"md-add"}
            size={Layout.icon.large}
            color={Colors.mainColor}
            onPress={() => navigation.navigate('AddDoc', { affaire: id })}
          />
        </IconView>
      </SectionWrapper>
      {showRea && displayRea()}
    </BusinessWrapper>
  );

})

BusinessWithDocs.propTypes = {
  id: PropTypes.string.isRequired,
  client: PropTypes.string.isRequired,
  designation: PropTypes.string.isRequired,
  prep: PropTypes.array,
  rea: PropTypes.array,
  modeleDocs: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  isConnected: PropTypes.bool.isRequired,
  editedDocs: PropTypes.array.isRequired,
  subFolder: PropTypes.array.isRequired,
  uploadingFile: PropTypes.func.isRequired,
  uploadingDocs: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  multipleUploadDocs: PropTypes.array,
  uploadingMulti: PropTypes.func.isRequired,
  uploadMultipleFiles: PropTypes.func.isRequired,
  docs: PropTypes.array,
  newDocs: PropTypes.array,
}

BusinessWithDocs.defaultProps = {
  prep: [],
  rea: [],
  multipleUploadDocs: [],
  docs: [],
  newDocs: []
}

const mapStateToProps = (state, props) => ({
  isConnected: state.network.isConnected,
  nbDocBusiness: state.user.nbDocBusiness,
  uploadingDocs: state.user.uploadingDocs,
  totalDocBusiness: state.user.totalDocBusiness,
  userId: state.user.id,
  name: state.user.name,
  editedDocs: state.user.editedDocs,
  modeleDocs: state.business.modeles,
  multipleUploadDocs: state.user.multipleUploadDocs.filter(m => m.affaire === props.title),
  docs: state.business.docs,
  newDocs: state.business.newDocs,
  subFolder: state.business.subFolder,
})

export default withNavigation(connect(mapStateToProps, { uploadingFile, uploadMultipleFiles, uploadingMulti })(BusinessWithDocs));
