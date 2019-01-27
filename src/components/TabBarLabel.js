import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import styled from 'styled-components';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const StyledText = styled(Text)`
  color: ${props => (props.focused ? Colors.tabIconSelected : Colors.tabIconDefault)};
  font-size: ${Layout.font.medium};
  text-align: center;
`;


class TabBarLabel extends React.Component {
  render() {
    return (
      <StyledText focused={this.props.focused} >
        {this.props.title}
      </StyledText>
    );
  }
}

TabBarLabel.propTypes = {
  title: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired
}

export default TabBarLabel;
