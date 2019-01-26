import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import Main from '../components/Main';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const userToken = this.props.token
    this.props.navigation.navigate(userToken !== '' ? 'App' : 'Auth');
  }

  
  render() {
    return (
      <Main>
          <ActivityIndicator />
      </Main>
    );
  }
}

AuthLoadingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  token: state.user.bearerToken
})

export default connect(mapStateToProps)(AuthLoadingScreen);
