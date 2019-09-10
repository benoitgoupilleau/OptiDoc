import React from 'react';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const TabBarIcon = React.memo(({ name, focused }) => (
  <Ionicons
    name={name}
    size={Layout.icon.default}
    style={{ marginBottom: -3 }}
    color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
  />
));

TabBarIcon.propTypes = {
  name: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired
};

export default TabBarIcon;
