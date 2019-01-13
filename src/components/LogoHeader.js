
import React from 'react';
import { Image } from 'react-native';

import logo from '../assets/images/logo.png'; 

class LogoHeader extends React.Component {
  render() {
    return (
      <Image
        source={logo}
        style={{ width: 100, height: 30 }}
      />
    );
  }
}

export default LogoHeader;
