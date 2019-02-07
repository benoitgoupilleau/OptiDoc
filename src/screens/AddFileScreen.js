import React from 'react';
import RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import styled from 'styled-components'
import { EXTERNAL_PATH } from 'react-native-dotenv';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import Modele from '../components/business/Modele';

import Layout from '../constants/Layout'
import Colors from '../constants/Colors'
import Folder from '../constants/Folder'

import { editFile } from '../redux/actions/user'
import { addNewDoc } from '../redux/actions/business'

const rootDir = RNFS.DocumentDirectoryPath;

const Wrapper = styled(View)`
  padding: 40px;
`;

const Title = styled(Text)`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.large};
  font-weight: bold;
  text-align: center;
`;

const Section = styled(Text)`
  font-size: ${Layout.font.large};
  font-weight: bold;
`
const Selector = styled(View)`
  flex-direction: row;
  align-items: center;
  width:100%;
`;

const Option = styled(TouchableOpacity)`
  width: 50%;
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
  height: 40px;
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
      Dossier2: 'PV',
      ModeleID: '',
      FileName: '',
      filePath: '',
      FileNameFinal: '',
    }
  } 
  static navigationOptions = {
    headerTitle: <HeaderTitle title="Ajouter un document"/>,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  handleSelectModele = (ModeleID, FileName, filePath) => {
    this.setState({ ModeleID, FileName, FileNameFinal: FileName, filePath })
  }

  onCreateFile = async () => {
    const businessId = this.props.navigation.getParam('affaire', '')
    const now = new Date();
    const CreatedOn = now.getFullYear() + '-' + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + '-' + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 })
    const date = now.getFullYear() + (now.getMonth() + 1).toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + now.getDate().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + 
      + now.getHours().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + now.getMinutes().toLocaleString('fr-FR', { minimumIntegerDigits: 2 }) + now.getMilliseconds().toLocaleString('fr-FR', { minimumIntegerDigits: 3 })
    const fileID= 'DOC_' + date;
    const modeleSelected = this.props.modeles.filter(m => m.ID_Document === this.state.ModeleID)[0]
    const Dossier3 = modeleSelected.DossierDestination;
    const destPath= `${rootDir}/${this.props.user.id}/${businessId}/${Folder.rea}/${fileID}.pdf`
    await RNFS.copyFile(this.state.filePath, destPath);
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
      .drawText('Affaire : ' + businessId, {
        x: modeleSelected.Zone2X ? parseInt(modeleSelected.Zone2X, 10) : 200,
        y: modeleSelected.Zone2Y ? parseInt(modeleSelected.Zone2Y, 10) : 830,
        fontSize: 10
      })
      .drawText('Date : ' + CreatedOn, {
        x: modeleSelected.Zone3X ? parseInt(modeleSelected.Zone3X, 10) : 400,
        y: modeleSelected.Zone3Y ? parseInt(modeleSelected.Zone3Y, 10) : 830,
        fontSize: 10
      })
      
    this.props.navigation.navigate('Business');
    PDFDocument
      .modify(destPath)
      .modifyPages(page1)
      .write()
      .then(() => {
        this.props.editFile({ ID: fileID, editPath: `${EXTERNAL_PATH}${fileID}.pdf`, isNew: true}, destPath)
        this.props.addNewDoc(newDoc)
      })
      .catch(e => console.log({ modifyPages: e}))
  }

  render() {
    const title = this.props.navigation.getParam('affaire', '')
    return (
      <Wrapper>
        <Title>{title}</Title>
        <Section>Sélectionner un modèle</Section>
        <Selector>
          <Option
            isSelected={this.state.Dossier2 === 'PV'}
            onPress={() => this.setState({ Dossier2: 'PV', FileName: '' })}
          >
            <OptionText isSelected={this.state.Dossier2 === 'PV'}>PV</OptionText>
          </Option>
          <Option
            isSelected={this.state.Dossier2 === 'DMOS'}
            onPress={() => this.setState({ Dossier2: 'DMOS', FileName: '' })}
          >
            <OptionText isSelected={this.state.Dossier2 === 'DMOS'}>DMOS</OptionText>
          </Option>
        </Selector>
        <ModeleList>
          {this.props.modeleDocs.filter(m => m.Dossier2 === this.state.Dossier2).map(m => (
            <Modele key={m.ID} FileName={m.FileName} handleSelect={() => this.handleSelectModele(m.ID, m.FileName, `${rootDir}/${this.props.user.id}/${Folder.modeleDocs}/${m.ID}.${m.Extension}`)} selected={this.state.FileName === m.FileName}/>))
          }
        </ModeleList>
        <ButtonWrapper>
          <FileNameInput
            placeholder="Nom du fichier"
            onChangeText={(FileNameFinal) => this.setState({ FileNameFinal })}
            value={this.state.FileNameFinal}
          />
          <StyledButton disabled={this.state.FileName === ''} onPress={this.onCreateFile}>
            <StyledText>Créer le fichier</StyledText>
          </StyledButton>
        </ButtonWrapper>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  modeleDocs: state.business.docs.filter(d => d.Dossier1 === 'Modele'),
  modeles: state.business.modeles,
  user: state.user
})

export default connect(mapStateToProps, { editFile, addNewDoc })(AddFileScreen);