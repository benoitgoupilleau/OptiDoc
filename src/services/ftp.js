import FTP from 'react-native-ftp';
import { FTP_URL, FTP_PORT, FTP_USERNAME, FTP_PASSWORD } from 'react-native-dotenv';

FTP.setup(FTP_URL, parseInt(FTP_PORT, 10));

export let ftpConnected = false;

FTP.login(FTP_USERNAME, FTP_PASSWORD).then(
  () => {
    ftpConnected = true
  },
  (error) => {
    console.error({error});
  }
);

export default FTP;