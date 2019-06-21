import API from './API';
import { config } from '../../config/config';

const { devicesApiRootUrl, apiAppKey } = config;

const api = new API({
  baseURL: devicesApiRootUrl,
  headers: { 'x-authorization': apiAppKey, 'Content-Type': 'application/json' },
});

export default api;
