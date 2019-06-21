import React from 'react';
import axios from 'axios';
import Auth from '../../../components/auth/Auth';
import { config } from '../../../config/config';

const UNKNOWN_ERROR = 'Unknown error';

export function getUserList() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/entropy/tracking/userslist`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then((response) => {
        let data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getQueryEvolution(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/tracking/queryevolution`,
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

export function accesstoentropy(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/tracking/accesstoentropy`,
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

export function accessbyarea(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/tracking/accessbyarea`,
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

export function accessbyuserarea(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/tracking/accessbyuserarea`, {
        api_token: Auth.getToken(),
        ...data
      })
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

export function userbyarea(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/tracking/userbyarea`,
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

export function ussage(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/tracking/ussage`, {
        api_token: Auth.getToken(),
        ...data
      })
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

export function querybyuser(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/tracking/querybyuser`,
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
