import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from "react-native";

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle />,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  news: state.news.newsList
})

export default connect(mapStateToProps)(HomeScreen);