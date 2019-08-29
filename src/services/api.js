import axios from 'axios';
import { API_URL } from 'react-native-dotenv';

const options = {
    baseURL: API_URL,
};

const instance = axios.create(options);

export default instance;