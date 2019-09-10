import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Orientation from 'react-native-orientation';

import Main from '../components/Main';
import Signin from '../components/Signing';

const SignInScreen = () => {
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <Main>
      <Signin />
    </Main>
  );
};

SignInScreen.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default SignInScreen;
