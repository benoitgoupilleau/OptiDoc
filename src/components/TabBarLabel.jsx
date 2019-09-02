import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const StyledText = styled.Text`
  color: ${props => (props.focused ? Colors.tabIconSelected : Colors.tabIconDefault)};
  font-size: ${Layout.font.medium};
  text-align: center;
`;


const TabBarLabel = ({ focused, title }) => (
  <StyledText focused={focused} >
    {title}
  </StyledText>
);

TabBarLabel.propTypes = {
  title: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired
}

export default TabBarLabel;
