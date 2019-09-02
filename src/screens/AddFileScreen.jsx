import React from 'react';
import RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Orientation from 'react-native-orientation';
import { View, Alert } from 'react-native';
import { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import { EXTERNAL_PATH } from 'react-native-dotenv';

import Logout from '../components/Logout';
import OfflineNotice from '../components/OfflineNotice';
import HeaderTitle from '../components/HeaderTitle'
import Modele from '../components/business/Modele';

import Folder from '../constants/Folder'
import Sentry from '../services/sentry'

import { editFile, downloadModels, forceDownloadModels } from '../redux/actions/user'
import { addNewDoc } from '../redux/actions/business'

import rootDir from '../services/rootDir';
import { getDateFormat } from '../services/dateFormat';

import { Wrapper, Title, Section, Selector, Option, OptionText, ModeleList, ButtonWrapper, StyledButton, StyledText, FileNameInput } from './AddFileScreen.styled';

class AddFileScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      typeModele: 'PV',
      ModeleID: '',
      fileName: '',
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
    if (this.props.modeleDownloaded !== 'in progress') {
      this.props.downloadModels(this.props.modeles);
    }
  }

  handleSelectModele = (ModeleID, fileName, filePath) => {
    const now = new Date();
    const { day, month, year } = getDateFormat(now);
    const date = `${day}.${month}.${year}`;
    this.setState({ ModeleID, fileName, FileNameFinal: `${fileName} ${date}`, filePath })
  }

  onCreateFile = () => {
    if (this.props.modeleDownloaded === 'in progress') {
      return Alert.alert('Modèle en cours de téléchargement', 'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants', [{ text: 'Ok' }]);
    } else {
      this.setState({creatingFile: true})
      const businessId = this.props.navigation.getParam('affaire', '')
      const now = new Date();
      const affaire = this.props.userBusiness.find((b) => b.id === businessId)
      const clientName = affaire ? `${affaire.client} - ${affaire.designation}` : businessId;
      const { day, month, year, hours, minutes, secondes } = getDateFormat(now);
      const createdOn = `${year}-${month}-${day}`;
      const date = `${year}${month}${day}${hours}${minutes}${secondes}`;
      const fileID= 'DOC_' + date;
      const modeleSelected = this.props.modeles.filter(m => m.iD_Document === this.state.ModeleID)[0]
      const dossier3 = modeleSelected.dossierDestination;
      const destPath= `${rootDir}/${this.props.user.id}/${businessId}/${Folder.rea}/${fileID}.pdf`;
      RNFS.mkdir(`${rootDir}/${this.props.user.id}/${businessId}/${Folder.rea}`)
        .then(() => RNFS.copyFile(this.state.filePath, destPath)
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
              createdBy: this.props.user.name,
              dossier2: 'Realisation',
              upLoadedOn: '1900-01-01',
              fileName: this.state.FileNameFinal,
              createdOn,
              dossier1: businessId,
              id: fileID,
              updatedOn: createdOn,
              updatedBy: this.props.user.name,
              commentaire: '',
              dossier3,
              serverPath: `${businessId}/Realisation/${dossier3}/${fileID}.pdf`,
              reviewedBy: '',
              extension: 'pdf',
              reviewed: 'N',
              locked: 'N',
              upLoadedBy: ''
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
              .drawText('Date : ' + createdOn, {
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
                this.props.addNewDoc(newDoc)
                return this.props.editFile({ id: fileID, editPath: `${EXTERNAL_PATH}${fileID}.pdf`, isNew: true, affaire: businessId, extension: 'pdf', dossier3 }, destPath)
              })
              .catch(e => {
                Sentry.captureException(e, { func: 'modifyPages', doc: 'AddFileScreen.js' })
                this.setState({creatingFile: false})
                return;
              })
          })
          .catch(e => {
            Sentry.captureException(e, { func: 'copyFile', doc: 'AddFileScreen.js' })
            this.setState({creatingFile: false})
            return;
          }))
        .catch((e) => {
          Sentry.captureException(e, { func: 'onCreateFile', doc: 'AddFileScreen.js' })
          this.setState({creatingFile: false})
          return;
        })
    }
  }

  forceDownload = () => {
    if (this.props.modeleDownloaded !== 'in progress') {
      this.props.forceDownloadModels(this.props.modeles);
    }
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
          <Section>Sélectionner un modèle</Section>
          <StyledButton onPress={this.forceDownload}>
            <StyledText>Retélécharger les modèles</StyledText>
          </StyledButton>
          <Selector>
            <Option
              isSelected={this.state.typeModele === 'PV'}
              onPress={() => this.setState({ typeModele: 'PV', fileName: '', FileNameFinal: '' })}
            >
              <OptionText isSelected={this.state.typeModele === 'PV'}>PV</OptionText>
            </Option>
            <Option
              isSelected={this.state.typeModele === 'DMOS'}
              onPress={() => this.setState({ typeModele: 'DMOS', fileName: '', FileNameFinal: '' })}
            >
              <OptionText isSelected={this.state.typeModele === 'DMOS'}>DMOS</OptionText>
            </Option>
            <Option
              isSelected={this.state.typeModele === 'CR'}
              onPress={() => this.setState({ typeModele: 'CR', fileName: '', FileNameFinal: '' })}
            >
              <OptionText isSelected={this.state.typeModele === 'CR'}>CR</OptionText>
            </Option>
          </Selector>
          <ModeleList>
            {this.props.modeles.filter(m => m.typeModele === this.state.typeModele).map(m => (
              <Modele 
                key={m.id}
                fileName={m.designation}
                handleSelect={() => this.handleSelectModele(m.iD_Document, m.designation, `${rootDir}/${Folder.modeleDocs}/${m.iD_Document}.pdf`)}
                selected={this.state.fileName === m.designation}
                openFile={() => this.props.navigation.navigate('Pdf', { title: m.designation, id: m.iD_Document, isModel: true, })}
              />))
            }
          </ModeleList>
          <ButtonWrapper>
            <FileNameInput
              placeholder="Nom du fichier"
              onChangeText={(FileNameFinal) => this.setState({ FileNameFinal })}
              value={this.state.FileNameFinal}
            />
            <StyledButton disabled={this.state.fileName === '' || this.state.creatingFile} onPress={this.onCreateFile}>
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
  userBusiness: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  editFile: PropTypes.func.isRequired,
  addNewDoc: PropTypes.func.isRequired,
  forceDownloadModels: PropTypes.func.isRequired,
  downloadModels: PropTypes.func.isRequired,
  modeles: PropTypes.array.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  modeles: state.business.modeles,
  user: state.user,
  userBusiness: state.business.business,
  modeleDownloaded: state.user.modeleDownloaded
})

export default connect(mapStateToProps, { editFile, addNewDoc, downloadModels, forceDownloadModels })(AddFileScreen);