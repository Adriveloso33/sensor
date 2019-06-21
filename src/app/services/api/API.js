import axios from 'axios';

class API {
  _api = null;
  _token = null;

  constructor(config = {}) {
    this._api = axios.create(config);
  }

  get = (path, params, options) => {
    return this._api
      .get(path, { params: this._addAuthToken(params) }, options)
      .then(this._getResponse)
      .catch(this._getError);
  };

  post = (path, params, options) => {
    return this._api
      .post(path, this._addAuthToken(params), options)
      .then(this._getResponse)
      .catch(this._getError);
  };

  put = (path, params, options) => {
    return this._api
      .put(path, this._addAuthToken(params), options)
      .then(this._getResponse)
      .catch(this._getError);
  };

  patch = (path, params, options) => {
    return this._api
      .patch(path, this._addAuthToken(params), options)
      .then(this._getResponse)
      .catch(this._getError);
  };

  delete = (path, params, options) => {
    return this._api
      .delete(path, { params: this._addAuthToken(params) }, options)
      .then(this._getResponse)
      .catch(this._getError);
  };

  _addAuthToken(params) {
    const paramsWithToken = params ? { ...params } : {};
    paramsWithToken.api_token = this._token;
    return paramsWithToken;
  }

  _getResponse = (response) => {
    const { data } = response;
    if (data.validator) {
      const validatorMessage = this._getValidatorMessage(data.validator);
      return this._errorObject(null, validatorMessage);
    }

    return this._responseObject(data);
  };

  _getValidatorMessage = (validator) => {
    for (let key in validator) {
      let error = validator[key];

      if (error.length) return error[0];
    }

    return 'Unknown Error Message';
  };

  _responseObject = (data) => {
    return Promise.resolve(data);
  };

  _getError = (error) => {
    if (error.response) {
      return this._errorObject(error.response.status, error.response.data);
    }

    if (error.request) {
      return this._errorObject(error.request.status, error.request.statusText);
    }

    return this._errorObject(error.status, error.message);
  };

  _errorObject = (code, message) => {
    return Promise.reject({
      code,
      message,
    });
  };

  setToken = (token) => {
    this._token = token;
    return this;
  };
}

export default API;
