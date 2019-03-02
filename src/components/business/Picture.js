import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Layout from '../../constants/Layout';

const { width } = Dimensions.get('window');
const pictureWidth = Math.round(width / 2) - 50

const PictureWrapper = styled(TouchableOpacity)`
  margin: ${Layout.space.small};
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  width: ${pictureWidth}px;
  position: relative;
`;

const ImageFrame = styled(Image)`
  width: 100%;
  height: ${Math.round(pictureWidth * 3 / 4)}px;
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
        size={Layout.icon.default}
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
