import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ScrollView, Text, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import News from '../components/news/News';
import Main from '../components/Main';

import { getNews, refreshNews } from '../redux/actions/news'
import { getDocs, getModeles, getBusiness, getAffaires } from '../redux/actions/business'
import { getTeam, getTeamRight, getUser } from '../redux/actions/team'
import { downloadModels } from '../redux/actions/user'
import { filterNews } from '../redux/selector/news'

import Layout from '../constants/Layout';

const { width } = Dimensions.get('window');

const StyledScroll = styled(ScrollView)`
  background-color: #ededed;
  padding-bottom: ${Layout.space.large};
  width: ${width};
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
    if (this.props.mssqlConnected){
      this.props.getNews();
      this.props.getDocs();
      this.props.getBusiness()
      this.props.getModeles()
      this.props.getTeam();
      this.props.getUser()
      this.props.getTeamRight();
      this.props.getAffaires()
      if(this.props.modeleDownloaded !== 'in progress') this.props.downloadModels(this.props.modeleDocs)
    } 
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
    if (!this.props.loaded) {
      return(
        <Main>
          <ActivityIndicator/>
        </Main>
      )
    }
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
        <Text>Aucune actualité à afficher</Text>
      </Main>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  newsList: PropTypes.array,
  getNews: PropTypes.func.isRequired,
  getDocs: PropTypes.func.isRequired,
  getTeam: PropTypes.func.isRequired,
  getTeamRight: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  refreshNews: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  mssqlConnected: PropTypes.bool.isRequired,
  teamLoaded: PropTypes.bool.isRequired,
  teamRightsLoaded: PropTypes.bool.isRequired,
}


const mapStateToProps = (state) => ({
  newsList: filterNews([...state.news.newsList]),
  loaded: state.news.loaded,
  refreshing: state.news.refreshing,
  mssqlConnected: state.network.mssqlConnected,
  usersLoaded: state.teams.usersLoaded,
  userId: state.user.id,
  modeleDocs: state.business.docs.filter(d => d.Dossier1 === 'Modele'),
  teamLoaded: state.teams.teamLoaded,
  teamRightsLoaded: state.teams.teamRightsLoaded,
  modeleDownloaded: state.user.modeleDownloaded
})

export default connect(mapStateToProps, { getNews, refreshNews, getDocs, getModeles, getBusiness, getTeam, getUser, getTeamRight, downloadModels, getAffaires })(HomeScreen);