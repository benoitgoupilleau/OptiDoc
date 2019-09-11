import { UPDATE_NET_STATUS, SET_INTERVAL } from './types';

export const connectivityChange = isConnected => ({
  type: UPDATE_NET_STATUS,
  isConnected
});

export const setIntervalNb = intervalNb => ({
  type: SET_INTERVAL,
  intervalNb
});
