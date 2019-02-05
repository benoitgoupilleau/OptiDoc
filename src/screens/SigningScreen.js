import React from 'react';
import PropTypes from 'prop-types';

import Main from '../components/Main';
import Signin from '../components/Signing';

class SignInScreen extends React.Component {

  render() {
    return (
      <Main>
        <Signin />
      </Main>
    );
  }
}

SignInScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default SignInScreen;
