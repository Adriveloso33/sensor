import axios from 'axios';
import Auth from '../../../auth/Auth';
import { config } from '../../../../config/config';

export function getCustomDashboards() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/entropy/panelconfig`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        let { data } = response;
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getCustomDashboardsShortcuts() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/entropy/panelshortcut`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        let { data } = response;
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
