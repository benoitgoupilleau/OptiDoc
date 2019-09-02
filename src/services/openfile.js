import FileViewer from 'react-native-file-viewer';
import { EXTERNAL_PATH } from 'react-native-dotenv';
import RNFS from 'react-native-fs';
import Sentry from './sentry'

export const openFile = async (id, Extension) => {
  const secondVersion = await RNFS.exists(`${EXTERNAL_PATH}${id}(0).${Extension}`)
  if (secondVersion) {
    RNFS.copyFile(`${EXTERNAL_PATH}${id}(0).${Extension}`, `${EXTERNAL_PATH}${id}.${Extension}`)
      .then(() => RNFS.unlink(`${EXTERNAL_PATH}${id}(0).${Extension}`)
          .then(() => FileViewer.open(`${EXTERNAL_PATH}${id}.${Extension}`, { showOpenWithDialog: true }))
      ).catch((e) => {
        Sentry.captureException(e, { func: 'openFile', doc: 'openFileService' })
        return;
      })
  } else {
    return FileViewer.open(`${EXTERNAL_PATH}${id}.${Extension}`, { showOpenWithDialog: true });
  } 
}