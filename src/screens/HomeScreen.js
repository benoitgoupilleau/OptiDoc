import React from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, View, Text } from "react-native";

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import News from '../components/news/News';

import { getNews } from '../redux/actions/news'
import { filterNews } from '../redux/selector/news'

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <HeaderTitle />,
    headerRight: <Logout />,
    headerStyle: {
      height: 70
    }
  }

  componentDidMount() {
    this.props.getNews();
  }



  render() {
    if (this.props.newsList.length > 0) {
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <ScrollView>
            {this.props.newsList.map(news => (
              <News key={news.ID} title={news.Titre} content={news.Contenu} />
            ))}
          </ScrollView>
        </View>
      )
    }
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  newsList: PropTypes.array,
  getNews: PropTypes.func.isRequired
}


const mapStateToProps = (state) => ({
  newsList: filterNews(state.news.newsList)
})

export default connect(mapStateToProps, { getNews })(HomeScreen);