import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View } from 'react-native';

import OfflineNotice from './OfflineNotice';

const Wrapper = styled(View)`
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const Main = ({children}) => (
  <Wrapper>
    <OfflineNotice />
    {children}
  </Wrapper>
);

Main.propTypes = {
  children: PropTypes.element.isRequired
}

export default Main;
