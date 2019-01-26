
import {
  LOGIN,
  LOGOUT
} from './types';

export const login = (email, id, bearerToken) => ({
  type: LOGIN,
  email,
  bearerToken,
  id,
}) 

export const logout = () => ({
  type: LOGOUT
}) 