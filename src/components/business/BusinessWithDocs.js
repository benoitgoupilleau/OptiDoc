import React from 'react';
import styled from 'styled-components';
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
import { downloadBusiness, uploadFile, uploadingFile, createFile } from '../../redux/actions/user'

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout'
import Folder from '../../constants/Folder'
import Tables from '../../constants/Tables';

import rootDir from '../../services/rootDir';

const BusinessWrapper = styled(View)`
  background: ${Colors.antiBackground};
  border-radius: 5px;
  margin: ${Layout.space.large};
  padding: ${Layout.space.medium};
  text-align: left;
`;

const MainSection = styled(View)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  margin: ${Layout.space.medium};
`

const Title = styled(Text)`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  flex-grow: 1;
  max-width: 500px;
  font-weight: bold;
`;

const SectionWrapper = styled(View)`
  align-items: center;
  border-bottom-color: ${Colors.mainColor};
  border-bottom-width: 1px;
  flex-direction: row;
  margin-bottom: ${Layout.space.medium};
  padding: ${Layout.space.medium};
`

const Section = styled(Text)`
  color: ${Colors.mainColor};
  font-size: ${Layout.font.medium};
  flex-grow: 1;
`;

const IconView = styled(View)`
  flex-direction: row;
`;

const Icons = styled(Ionicons)`
  padding: 0 ${Layout.space.medium};
`;

const AddIcons = styled(Icons)`
  padding: 0 ${Layout.space.large};
`;

const checkIfNew = (docs, id) => {
  const doc = docs.filter(d => d.ID === id)
  if (doc.length > 0 && !!doc[0].isNew) {
    return true;
  } 
  return false;
}

class BusinessWithDocs extends React.Component {
  state = {
    showPrep: false,
    showRea: false,
    upLoading: false,
    nbFiles: 0,
    totalFiles: 0
  }

  displayIcon = () => {
    const editedBusiness = this.props.editedDocs.filter(e => e.affaire === this.props.title)
    if (this.state.upLoading) {
      return (
        <View>
          <Text>{this.state.nbFiles}/{this.state.totalFiles}</Text>
          <ActivityIndicator />
        </View>)
    } else if (editedBusiness.length > 0) {
      return (
        <Ionicons
          name={"md-cloud-upload"}
          size={Layout.icon.large}
          color={Colors.secondColor}
          onPress={this.onUpload}
        />
      )
    }
    return null;
  }

  onUpload = async () => {
    if (this.props.isConnected && this.props.mssqlConnected) {
      if (this.props.uploadingDocs.length > 0) {
        Alert.alert('Envoi en cours', "Vous pourrez envoyer vos fichiers une fois l'envoi terminé", [{ text: 'Ok' }]);
      } else {
        const editedBusiness = this.props.editedDocs.filter(e => e.affaire === this.props.title)
        this.setState({upLoading: true, totalFiles: editedBusiness.length})
        for (let i = 0; i < editedBusiness.length; i++) {
          this.setState({nbFiles: i + 1});
          const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${editedBusiness[i].ID}(0).${editedBusiness[i].Extension}`);
          if (secondVersion) {
            await RNFS.copyFile(`${EXTERNAL_PATH}${editedBusiness[i].ID}(0).${editedBusiness[i].Extension}`, `${EXTERNAL_PATH}${editedBusiness[i].ID}.${editedBusiness[i].Extension}`);
            await RNFS.unlink(`${EXTERNAL_PATH}${editedBusiness[i].ID}(0).${editedBusiness[i].Extension}`)
          }
          const filePath = `${EXTERNAL_PATH}${editedBusiness[i].ID}.${editedBusiness[i].Extension}`;
          const destPath = `${rootDir}/${this.props.userId}/${this.props.title}/${Folder.rea}/${editedBusiness[i].ID}.${editedBusiness[i].Extension}`;
          const file = pick(this.props, Tables.docField);
          await RNFS.copyFile(filePath, destPath);
          const remoteDir = `./${this.props.title}/Realisation/${editedBusiness[i].Dossier3}`
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
          this.props.uploadingFile(editedBusiness[i].ID);
          if (editedBusiness[i].isNew) {
            this.props.createFile(filePath, fileToUpLoad, remoteDir)
          } else {
            this.props.uploadFile(filePath, fileToUpLoad, remoteDir);
          }
        }
        this.setState({upLoading: false})
      }
    } else {
      Alert.alert('Connexion impossible', 'Vous pourrez envoyer votre fichier une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  onDownload = () => {
    const { title, prep, rea, modeleDownloaded, downloadBusiness, userId, loadingBusiness, isConnected } = this.props;
    if (isConnected) {
      if (modeleDownloaded === 'in progress') {
        Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
      } else {
        if (loadingBusiness.includes(title)) {
          Alert.alert('Un téléchargement est en cours', "Merci d'attendre la fin du téléchargement", [{ text: 'Ok' }]);
        } else {
          downloadBusiness(userId, title, prep, rea)
        }
      }
    } else {
      Alert.alert('Vous êtes en mode hors-ligne', 'Vous pourrez télécharger cette affaire une fois votre connexion rétablie', [{ text: 'Ok' }]);
    }
  }

  toggleRea = () => {
    this.setState({showRea: !this.state.showRea})
  }

  togglePrep = () => {
    this.setState({showPrep: !this.state.showPrep})
  }

  displayPrep = () => {
    const { prep, rea, subFolder } = this.props;
    const listArbo = [];
    for (let i = 0; i < prep.length; i++) {
      const indexArbo = listArbo.findIndex(a => (a.NomDossier === prep[i].Dossier3 && a.Etape === 'Preparation'))
      if (indexArbo === -1) {
        const newArbo = subFolder.filter(s => (s.NomDossier === prep[i].Dossier3 && s.Etape === 'Preparation'))[0]
        listArbo.push(newArbo)
      }
    }
    listArbo.sort((a, b) => (a.NomDossier > b.NomDossier ? 1 : -1));
    return listArbo.map(arbo => <SubArbo key={'Prep' + arbo.NomDossier} title={arbo.Designation}>{prep.filter(p => p.Dossier3 === arbo.NomDossier)
      .sort((a, b) => (a.FileName > b.FileName ? 1 : -1))
      .map(p => <Document key={p.ID} {...p} type={Folder.prep} prep={prep} rea={rea} />)}
      </SubArbo>)
  }

  displayRea = () => {
    const { prep, rea, editedDocs, subFolder } = this.props;
    const listArbo = [];
    for (let i = 0; i < rea.length; i++) {
      const indexArbo = listArbo.findIndex(a => (a.NomDossier === rea[i].Dossier3 && a.Etape === 'Realisation'))
      if (indexArbo === -1) {
        const newArbo = subFolder.filter(s => (s.NomDossier === rea[i].Dossier3 && s.Etape === 'Realisation'))[0]
        listArbo.push(newArbo)
      }
    }
    listArbo.sort((a, b) => (a.NomDossier > b.NomDossier ? 1 : -1));
    return listArbo.map(arbo => <SubArbo key={'Rea' + arbo.NomDossier} title={arbo.Designation}>{rea.filter(r => r.Dossier3 === arbo.NomDossier)
      .sort((a, b) => (a.FileName > b.FileName ? 1 : -1))
      .map(r => <Document key={r.ID} isNew={checkIfNew(editedDocs, r.ID)} {...r} type={Folder.rea} prep={prep} rea={rea} />)}
      </SubArbo>)
  }

  render() {
    const { title, navigation } = this.props;
    const affaire = this.props.affaires.filter(a => a.ID === title)[0]
    const clientName = affaire ? `${affaire.Client} - ${affaire.Designation}` : title;
    return (
      <BusinessWrapper>
        <MainSection>
          <Title>{clientName}</Title>
          {this.displayIcon()}
        </MainSection>
        <SectionWrapper>
          <Icons
            name={this.state.showPrep ? "md-arrow-dropdown" : "md-arrow-dropright"}
            size={Layout.icon.default}
            color={Colors.mainColor}
            onPress={this.togglePrep}
          />
          <Section onPress={this.togglePrep} >Préparation</Section>
        </SectionWrapper>
        {this.state.showPrep && this.displayPrep()}
        <SectionWrapper>
          <Icons
            name={this.state.showRea ? "md-arrow-dropdown" : "md-arrow-dropright"}
            size={Layout.icon.default}
            color={Colors.mainColor}
            onPress={this.toggleRea}
          />
          <Section onPress={this.toggleRea} >Réalisation</Section>
          <IconView>
            <AddIcons
              name={"md-camera"}
              size={Layout.icon.large}
              color={Colors.mainColor}
              onPress={() => navigation.navigate('AddPic', { affaire: title }) }
            />
            <AddIcons
              name={"md-add"}
              size={Layout.icon.large}
              color={Colors.mainColor}
              onPress={() => navigation.navigate('AddDoc', { affaire: title })}
            />
          </IconView>
        </SectionWrapper>
        {this.state.showRea && this.displayRea()}
      </BusinessWrapper>
    );
  }
}

BusinessWithDocs.propTypes = {
  title: PropTypes.string.isRequired,
  prep: PropTypes.array,
  rea: PropTypes.array,
  modeleDocs: PropTypes.array.isRequired,
  loadingBusiness: PropTypes.array.isRequired,
  downloadBusiness: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  isConnected: PropTypes.bool.isRequired,
  affaires: PropTypes.array.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  editedDocs: PropTypes.array.isRequired,
  subFolder: PropTypes.array.isRequired,
  uploadingFile: PropTypes.func.isRequired,
  uploadingDocs: PropTypes.array.isRequired,
  mssqlConnected: PropTypes.bool.isRequired,
  createFile: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}

BusinessWithDocs.defaultProps = {
  prep: [],
  rea: []
}

const mapStateToProps = state => ({
  isConnected: state.network.isConnected,
  mssqlConnected: state.network.mssqlConnected,
  loadingBusiness: state.user.loadingBusiness,
  nbDocBusiness: state.user.nbDocBusiness,
  uploadingDocs: state.user.uploadingDocs,
  totalDocBusiness: state.user.totalDocBusiness,
  userId: state.user.id,
  name: state.user.name,
  editedDocs: state.user.editedDocs,
  modeleDocs: state.business.docs.filter(d => (d.Dossier1 && d.Dossier1 === 'Modele')),
  subFolder: state.business.subFolder,
  affaires: state.business.affaires,
  modeleDownloaded: state.user.modeleDownloaded
})

export default withNavigation(connect(mapStateToProps, { downloadBusiness, uploadingFile, createFile, uploadFile })(BusinessWithDocs));
