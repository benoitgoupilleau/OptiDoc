import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout'

const SubArboWrapper = styled(View)`
  align-items: center;
  flex-direction: row;
  margin-bottom: ${Layout.space.small};
  padding: ${Layout.space.small};
`

const SubArboEl = styled(Text)`
  color: ${Colors.secondColor};
  font-size: ${Layout.font.small};
  flex-grow: 1;
`;

const Icons = styled(Ionicons)`
  padding: 0 ${Layout.space.medium};
`;

class SubArbo extends React.Component {
  state = {
    display: false
  }

  toggleArbo = () => {
    this.setState({display: !this.state.display})
  }

  render() {
    return (
      <View>
      <SubArboWrapper>
          <Icons
            name={this.state.display ? "md-arrow-dropdown" : "md-arrow-dropright"}
            size={Layout.icon.default}
            color={Colors.secondColor}
            onPress={this.toggleArbo}
          />
          <SubArboEl onPress={this.toggleArbo} >{this.props.title}</SubArboEl>
        </SubArboWrapper>
        {this.state.display && this.props.children}
      </View>
    )
  }
}

SubArbo.propTypes = {
  title: PropTypes.string.isRequired
}

export default SubArbo;
