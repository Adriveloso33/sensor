import _ from 'lodash';

const UNKNOWN_ERROR_MSG = 'Unknown error';
const errorRoutes = [
  'statusText',
  'data.statusText',
  'response.data.statusText',
  'response.data.message',
  'data.message',
  'message',
];

export function validatorHandler(validator) {
  for (let key in validator) {
    let error = validator[key];

    if (error.length) return error[0];
  }

  return UNKNOWN_ERROR_MSG;
}

export function getErrorMessage(error) {
  if (!error) return UNKNOWN_ERROR_MSG;
  if (typeof error === 'string') return error;

  for (let i = 0; i < errorRoutes.length; i++) {
    const errorMessage = _.get(error, errorRoutes[i]);
    if (typeof errorMessage === 'string') return errorMessage;
  }

  return UNKNOWN_ERROR_MSG;
}
