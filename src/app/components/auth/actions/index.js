import axios from 'axios';
import Auth from '../Auth';
import { removeUserInfo, requestUserInfo } from '../../user';
import { config } from '../../../config/config';
import { errorMessage } from '../../notifications';

import { AUTH_USER, UNAUTH_USER } from './types';

const API_URL = config.apiRootUrl;
const UNKNOW_ERROR = 'Unknow error';

var unautenticated = false;

/**
 * return info about some error in the format below
 * {
 *    message: '',
 *    code: xxx
 * }
 */
function errorHandler(error) {
  let errorCode = 500;
  let errorMessage = 'Internal Server Error';

  if (error.response) {
    error = error.response;

    /* get message */
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    } else if (error.data) {
      errorMessage = error.data;
    } else if (error) {
      errorMessage = error;
    } else {
      errorMessage = 'Unknow error';
    }

    /* get code */
    if (error.status) {
      errorCode = error.status;
    }
  }

  return errorMessage;
}

function validatorHandler(validator) {
  for (let key in validator) {
    let error = validator[key];

    if (error.length) return error[0];
  }

  return UNKNOW_ERROR;
}

function authorizeUser(user, remember) {
  unautenticated = false;
  Auth.authenticateUser(user.api_token, remember);
  api.setToken(user.api_token);
  requestUserInfo();
  store.dispatch({ type: AUTH_USER });
}

function removeUser() {
  Auth.deauthenticateUser();
  store.dispatch({ type: UNAUTH_USER });
  removeUserInfo();
}

export function loginUser({ email, password }, remember) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/login`, { email, password })
      .then((response) => {
        let data = response.data;

        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          let user = data;
          authorizeUser(user, remember);

          return resolve(user);
        }
      })
      .catch((error) => {
        return reject(errorHandler(error));
      });
  });
}

export function registerUser({ name, email, password, password_confirmation }) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
      })
      .then((response) => {
        let data = response.data;

        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          let user = data;

          authorizeUser(user);

          return resolve(user);
        }
      })
      .catch((error) => {
        return reject(errorHandler(error));
      });
  });
}

export function logoutUser() {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/logout`, { api_token: Auth.getToken() })
      .then((response) => {
        removeUser();
        return resolve();
      })
      .catch((error) => {
        removeUser();
        return reject(errorHandler(error));
      });
  });
}

export function checkAuthError(error) {
  let errorCode = 0;
  if (error.response) {
    errorCode = error.response.status;
  }

  if (errorCode == 401 || errorCode == '401') {
    removeUser();
    if (!unautenticated) {
      errorMessage(
        'Authentication error',
        'Your session has expired. Your credentials have been used recently.',
        10000
      );
      unautenticated = true;
    }
    return true;
  }

  return false;
}
