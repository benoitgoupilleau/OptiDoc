import MSSQL, { config } from '../../services/mssql';

import {
  SET_NEWS
} from './types';


export const getNews = () => dispatch => {
    MSSQL.connect(config).then(() => 
      MSSQL.executeQuery('SELECT * FROM t_Informations').then((res) => dispatch(setNews(res)))
    )
  }
  
const setNews = (news) => ({
  type: SET_NEWS,
  news
})