import API from '../API';

describe('TEST API METHODS', function() {
  // create a mock api for test
  const apiResponse = {
    success: {
      message: 'Success Data',
    },
    error: {
      message: 'Error Data',
      code: 404,
    },
    validator: {
      validator: {
        parameterA: ['The parameterA field is required.'],
        parameterB: ['The parameterB field is required.'],
      },
    },
  };

  const api_token = 'wdna_2019';
  const headers = { 'x-authorization': '1991-05-28' };

  const port = 3500;
  const baseURL = `http://localhost:${port}`;

  before(function() {
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();

    // Adding body-parser middleware to parser JSON data
    app.use(bodyParser.json());

    // API routes
    app.get('/api', function(req, res) {
      return res.json(apiResponse.success);
    });

    app.post('/api', function(req, res) {
      return res.status(201).json(apiResponse.success);
    });

    app.post('/api/validator', function(req, res) {
      return res.send(apiResponse.validator);
    });

    app.post('/api/auth', function(req, res) {
      const appKey = req.get('x-authorization');
      const apiToken = req.param('api_token');

      const isAuthOk = appKey == headers['x-authorization'] && apiToken == api_token;
      if (!isAuthOk) {
        return res.status(apiResponse.error.code).send(apiResponse.error.message);
      }

      return res.send(apiResponse.success);
    });

    app.put('/api', function(req, res) {
      return res.status(201).json(apiResponse.success);
    });

    app.delete('/api', function(req, res) {
      return res.status(201).json(apiResponse.success);
    });

    app.patch('/api', function(req, res) {
      return res.status(201).json(apiResponse.success);
    });

    app.all('*', function(req, res) {
      return res.status(apiResponse.error.code).send(apiResponse.error.message);
    });

    // API server listing port 3000
    app.listen(port);
  });

  const expect = require('chai').expect;

  const apiService = new API({
    baseURL,
  });

  describe('GET API', function() {
    it('Should Success', function(done) {
      let response = null;
      apiService
        .get('api')
        .then((data) => {
          response = data;
        })
        .catch(() => {
          done(new Error('GET FAILED'));
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.success);
        done();
      }, 100);
    });

    it('Should Fail', function(done) {
      let response = null;
      apiService
        .get('apiFakeRoute')
        .then(() => {
          done(new Error('GET SUCCESS WHEN SHOULD FAIL'));
        })
        .catch((error) => {
          response = error;
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.error);
        done();
      }, 100);
    });
  });

  describe('POST API', function() {
    it('Should Success', function(done) {
      let response = null;
      apiService
        .post('api')
        .then((data) => {
          response = data;
        })
        .catch(() => {
          done(new Error('POST FAILED'));
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.success);
        done();
      }, 100);
    });

    it('Should Fail', function(done) {
      let response = null;
      apiService
        .post('apiFakeRoute')
        .then(() => {
          done(new Error('POST SUCCESS WHEN SHOULD FAIL'));
        })
        .catch((error) => {
          response = error;
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.error);
        done();
      }, 100);
    });

    it('Should Send Validator Object', function(done) {
      let response = null;
      apiService
        .post('api/validator')
        .then((data) => {
          done(new Error('POST SUCCES WHEN SHOULD FAIL'));
          response = data;
        })
        .catch((error) => {
          response = error;
        });

      setTimeout(() => {
        const { validator } = apiResponse.validator;
        expect(response.message).to.deep.equal(validator.parameterA[0]);
        done();
      }, 100);
    });
  });

  describe('API TOKEN AND X-AUTHORIZATION', function() {
    const apiServiceWithAuth = new API({
      baseURL,
      headers,
    });

    it('Should Success', function(done) {
      apiServiceWithAuth.setToken(api_token);

      let response = null;
      apiServiceWithAuth
        .post('api/auth')
        .then((data) => {
          response = data;
        })
        .catch(() => {
          done(new Error('POST FAILED'));
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.success);
        done();
      }, 100);
    });

    it('Should Fail', function(done) {
      apiServiceWithAuth.setToken(null);

      let response = null;
      apiServiceWithAuth
        .post('api/auth')
        .then(() => {
          done(new Error('POST SUCCESS WHEN SHOULD FAIL'));
        })
        .catch((error) => {
          response = error;
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.error);
        done();
      }, 100);
    });

    it('Should Fail becouse missing Headers', function(done) {
      const apiServiceWithOutAuth = new API({
        baseURL,
      });
      apiServiceWithOutAuth.setToken(api_token);

      let response = null;
      apiServiceWithOutAuth
        .post('api/auth')
        .then(() => {
          done(new Error('POST SUCCESS WHEN SHOULD FAIL'));
        })
        .catch((error) => {
          response = error;
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.error);
        done();
      }, 100);
    });
  });

  describe('PUT API', function() {
    it('Should Success', function(done) {
      let response = null;
      apiService
        .put('api')
        .then((data) => {
          response = data;
        })
        .catch(() => {
          done(new Error('PUT FAILED'));
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.success);
        done();
      }, 100);
    });
  });

  describe('DELETE API', function() {
    it('Should Success', function(done) {
      let response = null;
      apiService
        .delete('api')
        .then((data) => {
          response = data;
        })
        .catch(() => {
          done(new Error('DELETE FAILED'));
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.success);
        done();
      }, 100);
    });
  });

  describe('PATCH API', function() {
    it('Should Success', function(done) {
      let response = null;
      apiService
        .patch('api')
        .then((data) => {
          response = data;
        })
        .catch(() => {
          done(new Error('PATCH FAILED'));
        });

      setTimeout(() => {
        expect(response).to.deep.equal(apiResponse.success);
        done();
      }, 100);
    });
  });
});
