import axios from 'axios';
import Auth from '../../../components/auth/Auth';
import { config } from '../../../config/config';

import { validatorHandler } from '../../../helpers/requests/ErrorHandler';

export function getMainChart(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/dashboard/chart`,
        {
          api_token: Auth.getToken(),
          ...params,
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        const { data } = response || {};
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getMainTable(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/functionalities/drilldown/grid`,
        {
          api_token: Auth.getToken(),
          ...params,
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getAlarmsChart(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/functionalities/alarms/chart`,
        {
          api_token: Auth.getToken(),
          ...params,
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getMasterCellsGrid(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/mastercells/griddetails`, {
        api_token: Auth.getToken(),
        ...params,
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
