import React, { useState, useMemo, memo } from 'react';
import PropTypes from 'prop-types';

import Modele from './Modele';

import Layout from '../../constants/Layout';
import Colors from '../../constants/Colors';

import { SearchContainer, SearchInput, Icons, ModeleList, ClearIcons, Selector, Option, OptionText } from './ModeleSelect.styled';

const Types = [
  { id: 'HSE', designation: 'HSE' },
  { id: 'PV', designation: 'PV Qualité' },
  { id: 'DOCS', designation: 'Docs Clients' },
  { id: 'DMOS', designation: 'DMOS' },
];

const ModeleSelect = ({ modeles, handleSelectModele, onOpenFile, FileName, onSelectTypeModele }) => {
  const [search, setSearch] = useState('');
  const [TypeModele, setTypeModele] = useState(Types[0].id);
  const [selectedModels, setSelectedModels] = useState(() =>
    modeles.filter((m) => m.TypeModele === Types[0].id).sort((a, b) => (a.Designation.trim() > b.Designation.trim() ? 1 : -1))
  );
  const searchedModels = useMemo(
    () => modeles.filter((model) => model.Designation.toLowerCase().includes(search.toLowerCase())),
    [search, modeles]
  );

  const onChangeSearh = (value) => {
    setSearch(value.trim());
  };

  const onApplySearch = () => {
    if (search.length > 0) {
      setSelectedModels(
        modeles
          .filter((model) => model.Designation.toLowerCase().includes(search.toLowerCase()))
          .filter((m) => m.TypeModele === TypeModele)
          .sort((a, b) => (a.Designation.trim() > b.Designation.trim() ? 1 : -1))
      );
    }
  };

  const onClearSearch = () => {
    setSearch('');
    setSelectedModels(
      modeles.filter((m) => m.TypeModele === TypeModele).sort((a, b) => (a.Designation.trim() > b.Designation.trim() ? 1 : -1))
    );
  };

  const onSelectType = (type) => {
    setTypeModele(type);
    setSelectedModels(
      searchedModels.filter((m) => m.TypeModele === type).sort((a, b) => (a.Designation.trim() > b.Designation.trim() ? 1 : -1))
    );
    onSelectTypeModele();
  };

  return (
    <>
      <SearchContainer>
        <SearchInput placeholder="Rechercher" value={search} onChangeText={onChangeSearh} />
        {search.length > 0 && <ClearIcons name="md-close" size={Layout.icon.large} color={Colors.secondColor} onPress={onClearSearch} />}
        <Icons name="md-search" size={Layout.icon.large} color={Colors.secondColor} onPress={onApplySearch} />
      </SearchContainer>
      <Selector>
        {Types.map((type) => (
          <Option key={type.id} isSelected={TypeModele === type.id} onPress={() => onSelectType(type.id)}>
            <OptionText isSelected={TypeModele === type.id}>{type.designation}</OptionText>
          </Option>
        ))}
      </Selector>
      <ModeleList>
        {selectedModels.map((m) => (
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
  modeles: PropTypes.array.isRequired,
  onSelectTypeModele: PropTypes.func.isRequired,
};

export default memo(ModeleSelect);
