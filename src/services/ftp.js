import FTP from 'react-native-ftp';
import { FTP_URL_OUT, FTP_URL_HOME, FTP_PORT } from 'react-native-dotenv';

export const setUpFTPOut = () => FTP.setup(FTP_URL_OUT, parseInt(FTP_PORT, 10));

export const setUpFTPHome = () => FTP.setup(FTP_URL_HOME, parseInt(FTP_PORT, 10));


export default FTP;