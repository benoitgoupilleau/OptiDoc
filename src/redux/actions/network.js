import {
  UPDATE_NET_STATUS,
} from './types';


export const connectivityChange = (isConnected) => ({
  type: UPDATE_NET_STATUS,
  isConnected
})
