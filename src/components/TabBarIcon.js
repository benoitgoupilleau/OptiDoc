import React from 'react';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

class TabBarIcon extends React.Component {
  render() {
    return (
        <Ionicons
          name={this.props.name}
          size={Layout.icon.default}
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
