import React from 'react';

export function getErrorMessage(error) {
  let errorMessage = 'Unknown Error Message';

  if (typeof error === 'string') return error;

  if (error.response) {
    error = error.response;

    /* get message */
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    } else {
      errorMessage = error.statusText;
    }
  }

  return errorMessage;
}

export function getErrorCode(error) {
  let errorCode = 500;

  if (error.response) {
    errorCode = error.response.status;
  }

  return errorCode;
}
