import Sentry from '../../services/sentry'
import api from '../../services/api';

import { store } from '../store/store'

import {
  SET_NEWS,
  REFRESH_NEWS
} from './types';


export const getNews = () => dispatch => {
  const { user } = store.getState();
  return api.get('/api/news', { headers: { Authorization: `Bearer ${user.bearerToken}`}})
    .then((res) => {
      if (res && res.data) return dispatch(setNews(res.data))
    })
    .catch(e => {
      Sentry.captureException(e, { func: 'getNews', doc: 'newsActions' })
      return;
    })
}
  
const setNews = (news) => ({
  type: SET_NEWS,
  news
})

export const refreshNews = () => ({
  type: REFRESH_NEWS
})