import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import Document from './Document';

import { SectionWrapper } from './SectionDocs.styled';

const checkIfNew = (docs, ID) => {
  const doc = docs.filter((d) => d.ID === ID);
  if (doc.length > 0 && !!doc[0].isNew) {
    return true;
  }
  return false;
};

const SectionDocsSimplified = ({ id, docs, upForDownload, loadingFiles, editedDocs }) => {
  const documents = useMemo(() => [...docs.prep, ...docs.rea].sort((a, b) => (a.Designation > b.Designation ? 1 : -1)), [docs, id]);

  return (
    <>
      <SectionWrapper noTitle />
      {documents.length > 0 &&
        documents
          .sort((a, b) => (a.FileName > b.FileName ? 1 : -1))
          .map((r) => (
            <Document
              key={r.ID}
              isUpForDownload={upForDownload.includes(r.ID)}
              isLoadingFile={loadingFiles.includes(r.ID)}
              isNew={checkIfNew(editedDocs, r.ID)}
              {...r}
              {...docs}
            />
          ))}
    </>
  );
};

SectionDocsSimplified.propTypes = {
  id: PropTypes.string.isRequired,
  navigation: PropTypes.object.isRequired,
  docs: PropTypes.shape({ prep: PropTypes.array, rea: PropTypes.array }).isRequired,
  upForDownload: PropTypes.array.isRequired,
  loadingFiles: PropTypes.array.isRequired,
  editedDocs: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  upForDownload: state.user.upForDownload,
  loadingFiles: state.user.loadingFiles,
  editedDocs: state.user.editedDocs,
});

export default withNavigation(connect(mapStateToProps)(SectionDocsSimplified));
