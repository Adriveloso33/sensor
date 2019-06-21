import API from './API';
import { config } from '../../config/config';

const { apiRootUrl, apiAppKey } = config;

const api = new API({
  baseURL: apiRootUrl,
  headers: { 'x-authorization': apiAppKey, 'Content-Type': 'application/json' },
});

export default api;
