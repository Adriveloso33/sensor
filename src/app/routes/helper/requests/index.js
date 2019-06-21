import React from 'react';
import axios from 'axios';
import Auth from '../../../components/auth/Auth';
import { config } from '../../../config/config';

const UNKNOWN_ERROR = 'Unknown error';

export function sendemail(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/sendemail`, {
        api_token: Auth.getToken(),
        ...data
      })
      .then((response) => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve('ok');
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
