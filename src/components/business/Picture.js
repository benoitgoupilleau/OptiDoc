import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import Layout from '../../constants/Layout';

const PictureWrapper = styled(TouchableOpacity)`
  margin: ${Layout.space.small};
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  width: 200px;
  position: relative;
`;

const ImageFrame = styled(Image)`
  width: 100%;
  height: 100px;
`;

const Icons = styled(Ionicons)`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const Picture = ({ p, handleSelect, selected }) => (
  <PictureWrapper
    onPress={handleSelect}
  > 
    <ImageFrame
      source={{ uri: p.node.image.uri }}
    />
    {selected && 
      <Icons
        color="green"
        name="md-checkmark-circle"
        size={20}
      />
    }
  </PictureWrapper>
);

Picture.propTypes = {
  p: PropTypes.object.isRequired,
  handleSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired
}

export default Picture;
