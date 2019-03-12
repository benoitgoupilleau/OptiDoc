import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { ScrollView, Text, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import News from '../components/news/News';
import Main from '../components/Main';

import { getNews, refreshNews } from '../redux/actions/news'
import { getDocs, getModeles, getBusiness, getAffaires, getArbo } from '../redux/actions/business'
import { getUser } from '../redux/actions/team'
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
      hasFetchedData: false
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
    Orientation.lockToPortrait();
    if (this.props.mssqlConnected) {
      this.props.getNews(this.props.connectedHome);
      this.props.getDocs(this.props.docs, this.props.downloadedBusiness, this.props.editedDocs);
      this.props.getBusiness()
      this.props.getModeles()
      this.props.getUser()
      this.props.getAffaires()
      this.props.getArbo()
    }
    if (this.props.modeleDownloaded !== 'in progress' && this.props.mssqlConnected) {
      this.props.downloadModels(this.props.modeleDocs);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.refreshing !== this.props.refreshing) {
      this.setState({ refreshing: this.props.refreshing })
    }
  }

  onRefresh = () => {
    if (this.props.mssqlConnected) {
      this.setState({ refreshing: true });
      this.props.refreshNews();
      this.props.getNews(this.props.connectedHome)
    }
  }

  render() {
    if (this.props.mssqlConnected && !this.state.hasFetchedData){
      this.props.getNews(this.props.connectedHome);
      this.props.getDocs(this.props.docs, this.props.downloadedBusiness, this.props.editedDocs);
      this.props.getBusiness()
      this.props.getModeles()
      this.props.getUser()
      this.props.getAffaires()
      this.props.getArbo()
      if(this.props.modeleDownloaded !== 'in progress') this.props.downloadModels(this.props.modeleDocs)
      this.setState({hasFetchedData: true})
    } 
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
  refreshing: PropTypes.bool.isRequired,
  refreshNews: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  mssqlConnected: PropTypes.bool.isRequired,
  getBusiness: PropTypes.func.isRequired,
  getModeles: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  getAffaires: PropTypes.func.isRequired,
  getArbo: PropTypes.func.isRequired,
  downloadModels: PropTypes.func.isRequired,
  modeleDocs: PropTypes.array.isRequired,
  editedDocs: PropTypes.array.isRequired,
  downloadedBusiness: PropTypes.array.isRequired,
  docs: PropTypes.array.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  connectedHome: PropTypes.bool.isRequired
}


const mapStateToProps = (state) => ({
  newsList: filterNews([...state.news.newsList]),
  loaded: state.news.loaded,
  refreshing: state.news.refreshing,
  mssqlConnected: state.network.mssqlConnected,
  usersLoaded: state.teams.usersLoaded,
  userId: state.user.id,
  editedDocs: state.user.editedDocs,
  downloadedBusiness: state.user.downloadedBusiness,
  docs: state.business.docs,
  modeleDocs: state.business.docs.filter(d => (d.Dossier1 && d.Dossier1 === 'Modele')),
  modeleDownloaded: state.user.modeleDownloaded,
  connectedHome: state.network.connectedHome
})

export default connect(mapStateToProps, { getNews, refreshNews, getDocs, getModeles, getBusiness, getUser, downloadModels, getAffaires, getArbo })(HomeScreen);