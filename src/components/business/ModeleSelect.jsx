import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';

import Modele from './Modele';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

import { SearchContainer, SearchInput, Icons, ModeleList, ClearIcons } from './ModeleSelect.styled';

const ModeleSelect = ({ selectedModels, handleSelectModele, onOpenFile, FileName }) => {
  const [models, setModels] = useState(selectedModels);
  const [search, setSearch] = useState('');

  const onChangeSearh = (value) => {
    setSearch(value.trim());
  };

  const onApplySearch = () => {
    if (search.length > 0) {
      setModels(selectedModels.filter((model) => model.Designation.toLowerCase().includes(search.toLowerCase())));
    }
  };

  const onClearSearch = () => {
    setSearch('');
    setModels(selectedModels);
  };

  if (selectedModels.length === 0) {
    return null;
  }
  return (
    <>
      <SearchContainer>
        <SearchInput placeholder="Rechercher" value={search} onChangeText={onChangeSearh} />
        {search.length > 0 && <ClearIcons name="md-close" size={Layout.icon.large} color={Colors.secondColor} onPress={onClearSearch} />}
        <Icons name="md-search" size={Layout.icon.large} color={Colors.secondColor} onPress={onApplySearch} />
      </SearchContainer>
      <ModeleList>
        {models.map((m) => (
          <Modele
            key={m.ID}
            FileName={m.Designation}
            handleSelect={() => handleSelectModele(m)}
            selected={FileName === m.Designation}
            openFile={() => onOpenFile(m)}
          />
        ))}
      </ModeleList>
    </>
  );
};

ModeleSelect.propTypes = {
  FileName: PropTypes.string.isRequired,
  handleSelectModele: PropTypes.func.isRequired,
  onOpenFile: PropTypes.func.isRequired,
  selectedModels: PropTypes.array.isRequired,
};

export default memo(ModeleSelect);
