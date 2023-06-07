import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Folder from '../../constants/Folder';

import SubArbo from './SubArbo';
import Document from './Document';

import { SectionWrapper, Section, Icons, IconView, AddIcons } from './SectionDocs.styled';

const checkIfNew = (docs, ID) => {
  const doc = docs.filter((d) => d.ID === ID);
  if (doc.length > 0 && !!doc[0].isNew) {
    return true;
  }
  return false;
};

const SectionDocs = ({ id, docs, type, navigation, subFolder, upForDownload, loadingFiles, editedDocs }) => {
  const [showDocs, setShowDocs] = useState(false);

  const toggleDocs = () => {
    const toggle = !showDocs;
    setShowDocs(toggle);
  };

  const documents = useMemo(() => (type === Folder.prep ? docs.prep : docs.rea), [type, docs]);
  const listArbo = useMemo(() => {
    const list = [];
    for (let i = 0; i < documents.length; i++) {
      const indexArbo = list.findIndex((a) => a.nomDossier === documents[i].Dossier3 && a.etape === type);
      if (indexArbo === -1) {
        const newArbo = subFolder.filter((s) => s.nomDossier === documents[i].Dossier3 && s.etape === type)[0];
        list.push(newArbo);
      }
    }
    return list.sort((a, b) => (a.nomDossier > b.nomDossier ? 1 : -1));
  }, [documents, type]);

  const sectionName = type === Folder.prep ? 'Préparation' : 'Réalisation';
  return (
    <>
      <SectionWrapper>
        <Icons
          name={showDocs ? 'md-arrow-dropdown' : 'md-arrow-dropright'}
          size={Layout.icon.default}
          color={Colors.mainColor}
          onPress={toggleDocs}
        />
        <Section onPress={toggleDocs}>{sectionName}</Section>
        {type === Folder.rea && (
          <IconView>
            <AddIcons
              name={'md-camera'}
              size={Layout.icon.large}
              color={Colors.mainColor}
              onPress={() => navigation.navigate('AddPic', { affaire: id })}
            />
            <AddIcons
              name={'md-add'}
              size={Layout.icon.large}
              color={Colors.mainColor}
              onPress={() => navigation.navigate('AddDoc', { affaire: id })}
            />
          </IconView>
        )}
      </SectionWrapper>
      {showDocs &&
        listArbo.length > 0 &&
        listArbo.map((arbo) => (
          <SubArbo key={`${type}${arbo.nomDossier}`} title={arbo.designation}>
            {documents
              .filter((r) => r.Dossier3 === arbo.nomDossier)
              .sort((a, b) => (a.FileName > b.FileName ? 1 : -1))
              .map((r) => (
                <Document
                  key={r.ID}
                  isUpForDownload={upForDownload.includes(r.ID)}
                  isLoadingFile={loadingFiles.includes(r.ID)}
                  isNew={checkIfNew(editedDocs, r.ID)}
                  {...r}
                  type={type}
                  {...docs}
                />
              ))}
          </SubArbo>
        ))}
    </>
  );
};

SectionDocs.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  docs: PropTypes.shape({ prep: PropTypes.array, rea: PropTypes.array }).isRequired,
  subFolder: PropTypes.array.isRequired,
  upForDownload: PropTypes.array.isRequired,
  loadingFiles: PropTypes.array.isRequired,
  editedDocs: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  subFolder: state.business.subFolder,
  upForDownload: state.user.upForDownload,
  loadingFiles: state.user.loadingFiles,
  editedDocs: state.user.editedDocs,
});

export default withNavigation(connect(mapStateToProps)(SectionDocs));
