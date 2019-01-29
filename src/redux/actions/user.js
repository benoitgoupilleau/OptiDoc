import RNFS from 'react-native-fs';
import FTP from '../../services/ftp';
import { FTP_USERNAME, FTP_PASSWORD } from 'react-native-dotenv';
import {
  LOGIN,
  LOGOUT,
  BUSINESS_DOWNLOADED
} from './types';

import Folder from '../../constants/Folder'

const rootDir = RNFS.DocumentDirectoryPath;

export const login = (email, id, bearerToken) => ({
  type: LOGIN,
  email,
  bearerToken,
  id,
}) 

export const logout = (userId) => dispatch => RNFS.unlink(`${rootDir}/${userId}`)
  .then(() => dispatch({type: LOGOUT}))
  .catch(() => dispatch({ type: LOGOUT }))

export const downloadBusiness = (userId, businessId, prep, rea) => dispatch => RNFS.mkdir(`${rootDir}/${userId}/${businessId}`)
  .then(async () => {
    await FTP.login(FTP_USERNAME, FTP_PASSWORD);
    if (prep.length > 0) {
      await RNFS.mkdir(`${rootDir}/${userId}/${businessId}/${Folder.prep}`);
      for (let i = 0; i < prep.length; i += 1) {
        await FTP.downloadFile(`./${businessId}/Preparation/${prep[i].Dossier3}/${prep[i].ID}.${prep[i].Extension}`,
          `${rootDir}/${userId}/${businessId}/${Folder.prep}`)
      }
    }
    if (rea.length > 0) {
      await RNFS.mkdir(`${rootDir}/${userId}/${businessId}/${Folder.rea}`);
      for (let i = 0; i < rea.length; i += 1) {
        await FTP.downloadFile(`./${businessId}/Realisation/${rea[i].Dossier3}/${rea[i].ID}.${rea[i].Extension}`,
          `${rootDir}/${userId}/${businessId}/${Folder.rea}`)
      }
    }
    await FTP.logout()
    return dispatch(businessDownloaded(businessId))
  }).catch(async (e) => {
    await FTP.logout()
    console.log({ downloadBusiness: e})
  })

const businessDownloaded = (id) => ({
  type: BUSINESS_DOWNLOADED,
  id
})