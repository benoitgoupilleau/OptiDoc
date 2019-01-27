import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Layout from '../../constants/Layout';

const DocumentWrapper = styled(TouchableOpacity)`
  margin: ${Layout.space.medium};
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled(Text)`
  font-size: ${Layout.font.medium};
`;

const Document = ({ title }) => (
  <DocumentWrapper>
    <Title>{title}</Title>
    <Ionicons
      name={"md-eye"}
      size={26}
    />
  </DocumentWrapper>
);

Document.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string
}

Document.defaultProps = {
  type: 'prep'
}

export default Document;
