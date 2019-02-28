import FTP from 'react-native-ftp';
import { FTP_URL, FTP_PORT } from 'react-native-dotenv';

FTP.setup(FTP_URL, parseInt(FTP_PORT, 10));

export default FTP;