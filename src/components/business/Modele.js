import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';

import Layout from '../../constants/Layout';

import { ModeleWrapper, Title, Icons } from './Modele.styled';

const { width } = Dimensions.get('window');

const Modele = ({ fileName, handleSelect, selected, openFile }) => (
  <ModeleWrapper
    width={width}
    onPress={handleSelect}
    onLongPress={openFile}
  > 
    <Title width={width} selected={selected} >{fileName}</Title>
    {selected && 
      <Icons
        color="green"
        name="md-checkmark-circle"
        size={Layout.icon.default}
      />
    }
  </ModeleWrapper>
);

Modele.propTypes = {
  fileName: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  openFile: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
}

export default Modele;
