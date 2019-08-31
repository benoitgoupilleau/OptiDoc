import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { Text, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';

import Logout from '../components/Logout';
import HeaderTitle from '../components/HeaderTitle'
import News from '../components/news/News';
import Main from '../components/Main';

import { getNews, refreshNews } from '../redux/actions/news'
import { getDocs, getModeles, getBusiness, getAffaires, getArbo } from '../redux/actions/business'
import { downloadModels } from '../redux/actions/user'
import { filterNews } from '../redux/selector/news'

import Layout from '../constants/Layout';

const { width } = Dimensions.get('window');

const StyledScroll = styled.ScrollView`
  background-color: #ededed;
  padding-bottom: ${Layout.space.large};
  width: ${width};
`;

const HomeScreen = React.memo(({ refreshing, loaded, newsList, getNews, refreshNews, getBusiness, mssqlConnected, connectedHome, getDocs, docs, downloadedBusiness, editedDocs, getModeles, getAffaires, getArbo, modeleDownloaded, modeleDocs }) => {
  const [updatingNews, setUpdatingNews] = useState(refreshing);

  useEffect(() => {
    Orientation.lockToPortrait();
    getNews();
    getBusiness();
    if (mssqlConnected) {
      getDocs(connectedHome, docs, downloadedBusiness, editedDocs);
      getModeles(connectedHome)
      getAffaires(connectedHome)
      getArbo(connectedHome)
    }
    if (modeleDownloaded !== 'in progress' && mssqlConnected) {
      downloadModels(modeleDocs);
    }
  }, [])

  useEffect(() => {
    setUpdatingNews(refreshing)
  }, [refreshing])

  const onRefresh = () => {
    if (mssqlConnected) {
      setUpdatingNews(true)
      refreshNews();
      getNews()
    }
  }

  if (!loaded) {
    return (
      <Main>
        <ActivityIndicator />
      </Main>
    )
  }
  if (newsList.length > 0) {
    return (
      <Main>
        <StyledScroll
          refreshControl={
            <RefreshControl
              refreshing={updatingNews}
              onRefresh={onRefresh}
            />
          }
        >
          {newsList.map(news => (
            <News key={news.id} title={news.titre} content={news.contenu} />
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
})

HomeScreen.navigationOptions = {
  headerTitle: <HeaderTitle />,
  headerRight: <Logout />,
  headerStyle: {
    height: 70
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
  userId: state.user.id,
  editedDocs: state.user.editedDocs,
  downloadedBusiness: state.user.downloadedBusiness,
  docs: state.business.docs,
  modeleDocs: state.business.docs.filter(d => (d.Dossier1 && d.Dossier1 === 'Modele')),
  modeleDownloaded: state.user.modeleDownloaded,
  connectedHome: state.network.connectedHome
})

export default connect(mapStateToProps, { getNews, refreshNews, getDocs, getModeles, getBusiness, downloadModels, getAffaires, getArbo })(HomeScreen);