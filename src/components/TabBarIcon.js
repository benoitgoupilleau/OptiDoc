import React from 'react';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';

class TabBarIcon extends React.Component {
  render() {
    return (
        <Ionicons
          name={this.props.name}
          size={26}
          style={{ marginBottom: -3 }}
          color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
    );
  }
}

TabBarIcon.propTypes = {
  name: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired
}

export default TabBarIcon;
