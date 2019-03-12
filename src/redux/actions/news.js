import MSSQL_Out from '../../services/mssqlOut';
import MSSQL_Home from '../../services/mssqlHome';
import Tables from '../../constants/Tables';
import Sentry from '../../services/sentry'

import {
  SET_NEWS,
  REFRESH_NEWS
} from './types';


export const getNews = (connectHome = false) => dispatch => {
  if (connectHome) {
    return MSSQL_Home.executeQuery(`SELECT * FROM ${Tables.t_news}`)
      .then((res) => dispatch(setNews(res)))
      .catch(e => Sentry.captureException(e, { func: 'getNews', doc: 'newsActions' }))
  }
  return MSSQL_Out.executeQuery(`SELECT * FROM ${Tables.t_news}`)
    .then((res) => dispatch(setNews(res)))
    .catch(e => Sentry.captureException(e, { func: 'getNews', doc: 'newsActions' }))
}
  
const setNews = (news) => ({
  type: SET_NEWS,
  news
})

export const refreshNews = () => ({
  type: REFRESH_NEWS
})