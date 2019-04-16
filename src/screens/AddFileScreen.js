import React from 'react';
import RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Orientation from 'react-native-orientation';
import { Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import styled from 'styled-components'
import { EXTERNAL_PATH } from 'react-native-dotenv';

import Logout from '../components/Logout';
import OfflineNotice from '../components/OfflineNotice';
import HeaderTitle from '../components/HeaderTitle'
import Modele from '../components/business/Modele';

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import Folder from '../constants/Folder'
import Sentry from '../services/sentry'

import { editFile, downloadModels } from '../redux/actions/user'
import { addNewDoc } from '../redux/actions/business'

import rootDir from '../services/rootDir';

const Wrapper = styled(View)`
  padding: 20px;
`;

const Title = styled(Text)`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  font-weight: bold;
  text-align: center;
`;

const Section = styled(Text)`
  font-size: ${Layout.font.medium};
  font-weight: bold;
`
const Selector = styled(View)`
  flex-direction: row;
  align-items: center;
  width:100%;
`;

const Option = styled(TouchableOpacity)`
  width: 33%;
  align-items: center;
  ${props => props.isSelected && `background-color: ${Colors.thirdColor};`}
  border-bottom-color: ${Colors.thirdColor};
  border-bottom-width: 1px;
  margin: 10px 0;
`;

const OptionText = styled(Text)`
  ${props => props.isSelected && `color: white;`}
  padding: 5px 0;
`;

const ModeleList = styled(Selector)`
  margin: 10px 0;
  flex-flow: row wrap;
`;

const ButtonWrapper = styled(View)`
  align-items: center;
`;

const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${props => props.disabled ? Colors.thirdColor : Colors.mainColor};
  height: 30px;
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
  border-width: 1px;
`;

class AddFileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      TypeModele: 'PV',
      ModeleID: '',
      FileName: '',
      filePath: '',
      FileNameFinal: '',
      creatingFile: false
    }
  } 
  static navigationOptions = {
    headerTitle: <HeaderTitle noLogo title="Ajouter un document"/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    if (this.props.modeleDownloaded !== 'in progress' && this.props.mssqlConnected) {
      this.props.downloadModels(this.props.modeleDocs);
    }
  }

  handleSelectModele = (ModeleID, FileName, filePath) => {
    const now = new Date();
    const day = now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }).toString()
    const month = (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }).toString();
    const year = now.getFullYear()
    const date = `${day}.${month}.${year}`;
    this.setState({ ModeleID, FileName, FileNameFinal: `${FileName} ${date}`, filePath })
  }

  onCreateFile = () => {
    if (this.props.modeleDownloaded === 'in progress') {
      return Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
    } else {
      this.setState({creatingFile: true})
      const businessId = this.props.navigation.getParam('affaire', '')
      const now = new Date();
      const affaire = this.props.affaires.filter(a => a.ID === businessId)[0]
      const clientName = affaire ? `${affaire.Client} - ${affaire.Designation}` : businessId;
      const day = now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }).toString()
      const month = (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }).toString();
      const year = now.getFullYear();
      const hours = now.getHours().toLocaleString('fr-FR', { minimumIntegerDigits: 2 });
      const minutes = now.getMinutes().toLocaleString('fr-FR', { minimumIntegerDigits: 2 });
      const secondes = now.getMilliseconds().toLocaleString('fr-FR', { minimumIntegerDigits: 3 })
      const CreatedOn = `${year}-${month}-${day}`;
      const date = `${year}${month}${day}${hours}${minutes}${secondes}`;
      const fileID= 'DOC_' + date;
      const modeleSelected = this.props.modeles.filter(m => m.ID_Document === this.state.ModeleID)[0]
      const Dossier3 = modeleSelected.DossierDestination;
      const destPath= `${rootDir}/${this.props.user.id}/${businessId}/${Folder.rea}/${fileID}.pdf`;
      RNFS.mkdir(`${rootDir}/${this.props.user.id}/${businessId}/${Folder.rea}`)
        .then(() => RNFS.copyFile(this.state.filePath, destPath)
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
              FileName: this.state.FileNameFinal,
              CreatedOn,
              Dossier1: businessId,
              ID: fileID,
              UpdatedOn: CreatedOn,
              UpdatedBy: this.props.user.name,
              Commentaire: '',
              Dossier3,
              ServerPath: `${businessId}/Realisation/${Dossier3}/${fileID}.pdf`,
              ReviewedBy: '',
              Extension: 'pdf',
              Reviewed: 'N',
              Locked: 'N',
              UpLoadedBy: ''
            }
            const page1 = PDFPage
              .modify(0)
              .drawText('Rédigé par : ' + this.props.user.name, {
                x: modeleSelected.Zone1X ? parseInt(modeleSelected.Zone1X, 10) : 5,
                y: modeleSelected.Zone1Y ? parseInt(modeleSelected.Zone1Y, 10) : 830,
                fontSize: 10
              })
              .drawText('Affaire : ' + clientName, {
                x: modeleSelected.Zone2X ? parseInt(modeleSelected.Zone2X, 10) : 200,
                y: modeleSelected.Zone2Y ? parseInt(modeleSelected.Zone2Y, 10) : 830,
                fontSize: 10
              })
              .drawText('Date : ' + CreatedOn, {
                x: modeleSelected.Zone3X ? parseInt(modeleSelected.Zone3X, 10) : 500,
                y: modeleSelected.Zone3Y ? parseInt(modeleSelected.Zone3Y, 10) : 830,
                fontSize: 10
              })
              
            this.props.navigation.goBack();
            return PDFDocument
              .modify(destPath)
              .modifyPages(page1)
              .write()
              .then(() => {
                this.props.editFile({ ID: fileID, editPath: `${EXTERNAL_PATH}${fileID}.pdf`, isNew: true, affaire: businessId, Extension: 'pdf', Dossier3 }, destPath)
                return this.props.addNewDoc(newDoc)
              })
              .catch(e => {
                Sentry.captureException(e, { func: 'modifyPages', doc: 'AddFileScreen.js' })
                console.error({ e, func: 'modifyPages', doc: 'AddFileScreen.js' })
                this.setState({creatingFile: false})
                return;
              })
          })
          .catch(e => {
            Sentry.captureException(e, { func: 'copyFile', doc: 'AddFileScreen.js' })
            console.error({ e, func: 'copyFile', doc: 'AddFileScreen.js' })
            this.setState({creatingFile: false})
            return;
          }))
        .catch((e) => {
          Sentry.captureException(e, { func: 'onCreateFile', doc: 'AddFileScreen.js' })
          console.error({ e, func: 'onCreateFile', doc: 'AddFileScreen.js' })
          this.setState({creatingFile: false})
          return;
        })
    }
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
          <Section>Sélectionner un modèle</Section>
          <Selector>
            <Option
              isSelected={this.state.TypeModele === 'PV'}
              onPress={() => this.setState({ TypeModele: 'PV', FileName: '', FileNameFinal: '' })}
            >
              <OptionText isSelected={this.state.TypeModele === 'PV'}>PV</OptionText>
            </Option>
            <Option
              isSelected={this.state.TypeModele === 'DMOS'}
              onPress={() => this.setState({ TypeModele: 'DMOS', FileName: '', FileNameFinal: '' })}
            >
              <OptionText isSelected={this.state.TypeModele === 'DMOS'}>DMOS</OptionText>
            </Option>
            <Option
              isSelected={this.state.TypeModele === 'CR'}
              onPress={() => this.setState({ TypeModele: 'CR', FileName: '', FileNameFinal: '' })}
            >
              <OptionText isSelected={this.state.TypeModele === 'CR'}>CR</OptionText>
            </Option>
          </Selector>
          <ModeleList>
            {this.props.modeles.filter(m => m.TypeModele === this.state.TypeModele).map(m => (
              <Modele key={m.ID} FileName={m.Designation} handleSelect={() => this.handleSelectModele(m.ID_Document, m.Designation, `${rootDir}/${Folder.modeleDocs}/${m.ID_Document}.pdf`)} selected={this.state.FileName === m.Designation}/>))
            }
          </ModeleList>
          <ButtonWrapper>
            <FileNameInput
              placeholder="Nom du fichier"
              onChangeText={(FileNameFinal) => this.setState({ FileNameFinal })}
              value={this.state.FileNameFinal}
            />
            <StyledButton disabled={this.state.FileName === '' || this.state.creatingFile} onPress={this.onCreateFile}>
              <StyledText>{this.state.creatingFile ? 'Création en cours' : 'Créer le fichier'}</StyledText>
            </StyledButton>
          </ButtonWrapper>
        </Wrapper>
      </View>
    );
  }
}

AddFileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  affaires: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  editFile: PropTypes.func.isRequired,
  addNewDoc: PropTypes.func.isRequired,
  downloadModels: PropTypes.func.isRequired,
  modeles: PropTypes.array.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  modeleDocs: PropTypes.array.isRequired,
  mssqlConnected: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  modeleDocs: state.business.docs.filter(d => (d.Dossier1 && d.Dossier1 === 'Modele')),
  modeles: state.business.modeles,
  mssqlConnected: state.network.mssqlConnected,
  user: state.user,
  affaires: state.business.affaires,
  modeleDownloaded: state.user.modeleDownloaded
})

export default connect(mapStateToProps, { editFile, addNewDoc, downloadModels })(AddFileScreen);