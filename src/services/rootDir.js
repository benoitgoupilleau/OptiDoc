import RNFS from 'react-native-fs';

let rootDir = RNFS.DocumentDirectoryPath;

export const setRootDir = async () => {
  const extSdCard = await RNFS.exists('/storage/extSdCard/');
  const sdcard1 = await RNFS.exists('/storage/sdcard1/');
  const sdcard0 = await RNFS.exists('/storage/sdcard0/');
  if (extSdCard) {
    rootDir = '/storage/extSdCard/';
  } else if (sdcard1) {
    rootDir = '/storage/sdcard1/';
  } else if (sdcard0) {
    rootDir = '/storage/sdcard0/';
  }
};

export default rootDir;
