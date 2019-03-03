import MSSQL from '../../services/mssql';
import Tables from '../../constants/Tables';
import Sentry from '../../services/sentry'

import {
  SET_NEWS,
  REFRESH_NEWS
} from './types';


export const getNews = () => dispatch => MSSQL.executeQuery(`SELECT * FROM ${Tables.t_news}`)
  .then((res) => dispatch(setNews(res)))
  .catch(e => Sentry.captureException(e, { func: 'getNews', doc: 'newsActions' }))
  
const setNews = (news) => ({
  type: SET_NEWS,
  news
})

export const refreshNews = () => ({
  type: REFRESH_NEWS
})