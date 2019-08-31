import axios from 'axios';
import { API_URL } from 'react-native-dotenv';

import NavigationService from './navigationService';
import { store } from '../redux/store/store'
import { sessionExpired } from '../redux/actions/user'

const options = {
    baseURL: API_URL,
};

const instance = axios.create(options);

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (401 === error.response.status) {
        NavigationService.navigate('Auth');
        store.dispatch(sessionExpired())
    } else {
        return Promise.reject(error);
    }
})

export default instance;