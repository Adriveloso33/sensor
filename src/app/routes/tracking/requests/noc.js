import React from 'react';
import axios from 'axios';
import Auth from '../../../components/auth/Auth';
import { config } from '../../../config/config';

const UNKNOWN_ERROR = 'Unknown error';

export function piehuawei2g(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/noc/piehuawei2g`,
        {
          api_token: Auth.getToken(),
          ...data
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function piehuawei3g(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/noc/piehuawei3g`,
        {
          api_token: Auth.getToken(),
          ...data
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function piehuawei4g(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/noc/piehuawei4g`,
        {
          api_token: Auth.getToken(),
          ...data
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function pieericsson3g(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/noc/pieericsson3g`,
        {
          api_token: Auth.getToken(),
          ...data
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function pieericsson4g(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/noc/pieericsson4g`,
        {
          api_token: Auth.getToken(),
          ...data
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function validatorHandler(validator) {
  for (let key in validator) {
    let error = validator[key];

    if (error.length) return error[0];
  }

  return UNKNOWN_ERROR;
}
