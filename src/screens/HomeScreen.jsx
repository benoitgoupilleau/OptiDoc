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
import { getDocs, getModeles, getBusiness, getArbo } from '../redux/actions/business'
import { downloadModels } from '../redux/actions/user'
import { filterNews } from '../redux/selector/news'

import Layout from '../constants/Layout';

const { width } = Dimensions.get('window');

const StyledScroll = styled.ScrollView`
  background-color: #ededed;
  padding-bottom: ${Layout.space.large};
  width: ${width};
`;

const HomeScreen = React.memo(({ token, refreshing, loaded, newsList, getNews, refreshNews, getBusiness, getDocs, docs, downloadedBusiness, editedDocs, getModeles, getArbo, modeleDownloaded, modeleDocs }) => {
  const [updatingNews, setUpdatingNews] = useState(refreshing);
  
  useEffect(() => {
    if (token !== '') {
      getNews();
      getBusiness();
      getModeles()
      getDocs(docs, downloadedBusiness, editedDocs);
      getArbo()
      if (modeleDownloaded !== 'in progress') {
        downloadModels(modeleDocs);
      }
    }
  }, [token])

  useEffect(() => {
    Orientation.lockToPortrait();
  }, [])

  useEffect(() => {
    setUpdatingNews(refreshing)
  }, [refreshing])

  const onRefresh = () => {
    setUpdatingNews(true)
    refreshNews();
    getNews()
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
  getBusiness: PropTypes.func.isRequired,
  getModeles: PropTypes.func.isRequired,
  getArbo: PropTypes.func.isRequired,
  downloadModels: PropTypes.func.isRequired,
  modeleDocs: PropTypes.array.isRequired,
  editedDocs: PropTypes.array.isRequired,
  downloadedBusiness: PropTypes.array.isRequired,
  docs: PropTypes.array.isRequired,
  modeleDownloaded: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
}


const mapStateToProps = (state) => ({
  token: state.user.bearerToken,
  newsList: filterNews([...state.news.newsList]),
  loaded: state.news.loaded,
  refreshing: state.news.refreshing,
  userId: state.user.userId,
  editedDocs: state.user.editedDocs,
  downloadedBusiness: state.user.downloadedBusiness,
  docs: state.business.docs,
  modeleDocs: state.business.modeles,
  modeleDownloaded: state.user.modeleDownloaded,
})

export default connect(mapStateToProps, { getNews, refreshNews, getDocs, getModeles, getBusiness, downloadModels, getArbo })(HomeScreen);