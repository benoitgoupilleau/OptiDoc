import React from "react";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ScrollView, Text, RefreshControl } from "react-native";

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import News from '../components/news/News';
import Main from '../components/Main';

import { getNews, refreshNews } from '../redux/actions/news'
import { filterNews } from '../redux/selector/news'

const StyledScroll = styled(ScrollView)`
  background-color: #ededed;
  padding-bottom: 20px;
`;

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: props.refreshing,
    }
  }

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

  componentDidUpdate(prevProps) {
    if (prevProps.refreshing !== this.props.refreshing) {
      this.setState({ refreshing: this.props.refreshing })
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.refreshNews();
    this.props.getNews()
  }

  render() {
    if (this.props.newsList.length > 0) {
      return (
        <Main>
          <StyledScroll
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          >
            {this.props.newsList.map(news => (
              <News key={news.ID} title={news.Titre} content={news.Contenu} />
            ))}
          </StyledScroll>
        </Main>
      )
    }
    return (
      <Main>
        <Text>Home Screen</Text>
      </Main>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  newsList: PropTypes.array,
  getNews: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  refreshNews: PropTypes.func.isRequired
}


const mapStateToProps = (state) => ({
  newsList: filterNews(state.news.newsList),
  loaded: state.news.loaded,
  refreshing: state.news.refreshing
})

export default connect(mapStateToProps, { getNews, refreshNews })(HomeScreen);