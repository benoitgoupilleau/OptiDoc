import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { withNavigation } from 'react-navigation';

import Layout from '../../constants/Layout';

const DocumentWrapper = styled(TouchableOpacity)`
  margin: ${Layout.space.medium};
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled(Text)`
  font-size: ${Layout.font.medium};
`;

const Document = ({ title, type, navigation }) => (
  <DocumentWrapper
    onPress={() => navigation.navigate('Pdf', { title, filePath: '' })}
  >
    <Title>{title}</Title>
    {type === 'rea' &&
      <Ionicons
        name={"md-create"}
        size={26}
        onPress={() => console.log('md-create clicked')}
      />
    }
  </DocumentWrapper>
);

Document.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  navigation: PropTypes.object.isRequired,
}

Document.defaultProps = {
  type: 'prep'
}

export default withNavigation(Document);