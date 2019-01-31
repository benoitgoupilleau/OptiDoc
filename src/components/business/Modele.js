import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import Layout from '../../constants/Layout';

const ModeleWrapper = styled(TouchableOpacity)`
  margin: ${Layout.space.medium};
  flex-direction: row;
  justify-content: space-between;
  flex: auto;
`;

const Title = styled(Text)`
  font-size: ${Layout.font.medium};
`;

const Icons = styled(Ionicons)`
  padding: 0 10px;
`;

const Modele = ({ FileName, handleSelect, selected }) => (
  <ModeleWrapper
    onPress={handleSelect}
  > 
    <Title>{FileName}</Title>
    {selected && 
      <Icons
        color="green"
        name="md-checkmark-circle"
        size={26}
      />
    }
  </ModeleWrapper>
);

Modele.propTypes = {
  FileName: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
}

export default Modele;
