import React, { useState, useEffect } from 'react';
import RNFS from 'react-native-fs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Orientation from 'react-native-orientation';
import { Alert } from 'react-native';
import { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import { EXTERNAL_PATH } from 'react-native-dotenv';

import Logout from '../components/Logout';
import OfflineNotice from '../components/OfflineNotice';
import HeaderTitle from '../components/HeaderTitle';
import Modele from '../components/business/Modele';

import Folder from '../constants/Folder';
import Sentry from '../services/sentry';

import {
  editFile,
  downloadModels,
  forceDownloadModels
} from '../redux/actions/user';
import { addNewDoc } from '../redux/actions/business';

import rootDir from '../services/rootDir';
import { getDateFormat } from '../services/dateFormat';

import {
  Container,
  Wrapper,
  Title,
  Section,
  Selector,
  Option,
  OptionText,
  ModeleList,
  ButtonWrapper,
  StyledButton,
  StyledText,
  FileNameInput
} from './AddFileScreen.styled';

const AddFileScreen = React.memo(
  ({
    navigation,
    user,
    userBusiness,
    modeleDownloaded,
    modeles,
    editFile,
    addNewDoc,
    downloadModels,
    forceDownloadModels
  }) => {
    const [TypeModele, setTypeModele] = useState('PV');
    const [ModeleID, setModeleID] = useState('');
    const [FileName, setFileName] = useState('');
    const [filePath, setFilePath] = useState('');
    const [FileNameFinal, setFileNameFinal] = useState('');
    const [creatingFile, setCreatingFile] = useState(false);

    useEffect(() => {
      Orientation.lockToPortrait();
      if (modeleDownloaded !== 'in progress') {
        downloadModels(modeles);
      }
    }, []);

    const handleSelectModele = (ModeleID, FileName, filePath) => {
      const now = new Date();
      const { day, month, year } = getDateFormat(now);
      const date = `${day}.${month}.${year}`;
      setModeleID(ModeleID);
      setFileName(FileName);
      setFileNameFinal(`${FileName} ${date}`);
      setFilePath(filePath);
    };

    const onCreateFile = () => {
      if (modeleDownloaded === 'in progress') {
        return Alert.alert(
          'Modèle en cours de téléchargement',
          'Les fichiers modèles sont en cours de téléchargement. Merci de réessayer dans quelques instants',
          [{ text: 'Ok' }]
        );
      } else {
        setCreatingFile(true);
        const businessId = navigation.getParam('affaire', '');
        const now = new Date();
        const affaire = userBusiness.find(b => b.id === businessId);
        const clientName = affaire
          ? `${affaire.client} - ${affaire.designation}`
          : businessId;
        const { day, month, year, hours, minutes, secondes } = getDateFormat(
          now
        );
        const CreatedOn = `${year}-${month}-${day}`;
        const date = `${year}${month}${day}${hours}${minutes}${secondes}`;
        const fileID = 'DOC_' + date;
        const modeleSelected = modeles.filter(
          m => m.ID_Document === ModeleID
        )[0];
        const Dossier3 = modeleSelected.DossierDestination;
        const destPath = `${rootDir}/${user.userId}/${businessId}/${Folder.rea}/${fileID}.pdf`;
        RNFS.mkdir(`${rootDir}/${user.userId}/${businessId}/${Folder.rea}`)
          .then(() =>
            RNFS.copyFile(filePath, destPath)
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
                  CreatedBy: user.name,
                  Dossier2: 'Realisation',
                  UpLoadedOn: '1900-01-01',
                  FileName: FileNameFinal,
                  CreatedOn,
                  Dossier1: businessId,
                  ID: fileID,
                  UpdatedOn: CreatedOn,
                  UpdatedBy: user.name,
                  Commentaire: '',
                  Dossier3,
                  ServerPath: `${businessId}/Realisation/${Dossier3}/${fileID}.pdf`,
                  ReviewedBy: '',
                  Extension: 'pdf',
                  Reviewed: 'N',
                  Locked: 'N',
                  UpLoadedBy: ''
                };
                const page1 = PDFPage.modify(0)
                  .drawText('Rédigé par : ' + user.name, {
                    x: modeleSelected.Zone1X
                      ? parseInt(modeleSelected.Zone1X, 10)
                      : 5,
                    y: modeleSelected.Zone1Y
                      ? parseInt(modeleSelected.Zone1Y, 10)
                      : 830,
                    fontSize: 10
                  })
                  .drawText('Affaire : ' + clientName, {
                    x: modeleSelected.Zone2X
                      ? parseInt(modeleSelected.Zone2X, 10)
                      : 200,
                    y: modeleSelected.Zone2Y
                      ? parseInt(modeleSelected.Zone2Y, 10)
                      : 830,
                    fontSize: 10
                  })
                  .drawText('Date : ' + CreatedOn, {
                    x: modeleSelected.Zone3X
                      ? parseInt(modeleSelected.Zone3X, 10)
                      : 500,
                    y: modeleSelected.Zone3Y
                      ? parseInt(modeleSelected.Zone3Y, 10)
                      : 830,
                    fontSize: 10
                  });

                navigation.goBack();
                return PDFDocument.modify(destPath)
                  .modifyPages(page1)
                  .write()
                  .then(() => {
                    addNewDoc(newDoc);
                    return editFile(
                      {
                        ID: fileID,
                        editPath: `${EXTERNAL_PATH}${fileID}.pdf`,
                        isNew: true,
                        affaire: businessId,
                        Extension: 'pdf',
                        Dossier3
                      },
                      destPath
                    );
                  })
                  .catch(e => {
                    Sentry.captureException(e, {
                      func: 'modifyPages',
                      doc: 'AddFileScreen.js'
                    });
                    setCreatingFile(false);
                    return;
                  });
              })
              .catch(e => {
                Sentry.captureException(e, {
                  func: 'copyFile',
                  doc: 'AddFileScreen.js'
                });
                setCreatingFile(false);
                return;
              })
          )
          .catch(e => {
            Sentry.captureException(e, {
              func: 'onCreateFile',
              doc: 'AddFileScreen.js'
            });
            setCreatingFile(false);
            return;
          });
      }
    };

    const forceDownload = () => {
      if (modeleDownloaded !== 'in progress') {
        forceDownloadModels(modeles);
      }
    };

    const onPress = type => {
      setTypeModele(type);
      setFileName('');
      setFileNameFinal('');
    };

    const id_affaire = navigation.getParam('affaire', '');
    const business = userBusiness.find(b => b.id === id_affaire);
    const clientName = business
      ? `${business.client} - ${business.designation}`
      : id_affaire;
    return (
      <Container>
        <OfflineNotice />
        <Wrapper>
          <Title>{clientName}</Title>
          <Section>Sélectionner un modèle</Section>
          <StyledButton onPress={forceDownload}>
            <StyledText>Retélécharger les modèles</StyledText>
          </StyledButton>
          <Selector>
            <Option
              isSelected={TypeModele === 'PV'}
              onPress={() => onPress('PV')}
            >
              <OptionText isSelected={TypeModele === 'PV'}>PV</OptionText>
            </Option>
            <Option
              isSelected={TypeModele === 'DMOS'}
              onPress={() => onPress('DMOS')}
            >
              <OptionText isSelected={TypeModele === 'DMOS'}>DMOS</OptionText>
            </Option>
            <Option
              isSelected={TypeModele === 'CR'}
              onPress={() => onPress('CR')}
            >
              <OptionText isSelected={TypeModele === 'CR'}>CR</OptionText>
            </Option>
          </Selector>
          <ModeleList>
            {modeles
              .filter(m => m.TypeModele === TypeModele)
              .map(m => (
                <Modele
                  key={m.ID}
                  FileName={m.Designation}
                  handleSelect={() =>
                    handleSelectModele(
                      m.ID_Document,
                      m.Designation,
                      `${rootDir}/${Folder.modeleDocs}/${m.ID_Document}.pdf`
                    )
                  }
                  selected={FileName === m.Designation}
                  openFile={() =>
                    navigation.navigate('Pdf', {
                      title: m.Designation,
                      ID: m.ID_Document,
                      isModel: true
                    })
                  }
                />
              ))}
          </ModeleList>
          <ButtonWrapper>
            <FileNameInput
              placeholder="Nom du fichier"
              onChangeText={FileNameFinal => setFileNameFinal(FileNameFinal)}
              value={FileNameFinal}
            />
            <StyledButton
              disabled={FileName === '' || creatingFile}
              onPress={onCreateFile}
            >
              <StyledText>
                {creatingFile ? 'Création en cours' : 'Créer le fichier'}
              </StyledText>
            </StyledButton>
          </ButtonWrapper>
        </Wrapper>
      </Container>
    );
  }
);

AddFileScreen.navigationOptions = {
  headerTitle: <HeaderTitle noLogo title="Ajouter un document" />,
  headerRight: <Logout />,
  headerStyle: {
    height: 70
  }
};

AddFileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  userBusiness: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  editFile: PropTypes.func.isRequired,
  addNewDoc: PropTypes.func.isRequired,
  forceDownloadModels: PropTypes.func.isRequired,
  downloadModels: PropTypes.func.isRequired,
  modeles: PropTypes.array.isRequired,
  modeleDownloaded: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  modeles: state.business.modeles,
  user: state.user,
  userBusiness: state.business.business,
  modeleDownloaded: state.user.modeleDownloaded
});

export default connect(
  mapStateToProps,
  { editFile, addNewDoc, downloadModels, forceDownloadModels }
)(AddFileScreen);
