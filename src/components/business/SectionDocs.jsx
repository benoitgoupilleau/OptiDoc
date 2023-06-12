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
  const [showDocs, setShowDocs] = useState(type === Folder.sysDoc);

  const toggleDocs = () => {
    const toggle = !showDocs;
    setShowDocs(toggle);
  };

  const documents = useMemo(() => (type === Folder.prep ? docs.prep : type === Folder.sysDoc ? docs.sysDoc : docs.rea), [type, docs]);
  const listArbo = useMemo(() => {
    const list = [];
    for (let i = 0; i < documents.length; i++) {
      const indexArbo = list.findIndex((a) => a.nomDossier === documents[i].Dossier3 && a.etape.toLowerCase() === type.toLowerCase());
      if (indexArbo === -1) {
        const newArbo = subFolder.filter((s) => s.nomDossier === documents[i].Dossier3 && s.etape.toLowerCase() === type.toLowerCase())[0];
        list.push(newArbo);
      }
    }
    return list.sort((a, b) => (a.nomDossier > b.nomDossier ? 1 : -1));
  }, [documents, type]);

  const sectionName = type === Folder.prep ? 'Préparation' : 'Réalisation';
  return (
    <>
      <SectionWrapper>
        {type !== Folder.sysDoc && (
          <>
            <Icons
              name={showDocs ? 'md-caret-down-outline' : 'md-caret-forward'}
              size={Layout.icon.default}
              color={Colors.mainColor}
              onPress={toggleDocs}
            />
            <Section onPress={toggleDocs}>{sectionName}</Section>
          </>
        )}
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
  docs: PropTypes.shape({ prep: PropTypes.array, rea: PropTypes.array, sysDoc: PropTypes.array }).isRequired,
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
