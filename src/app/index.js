/* IMPORT STYLES */
import '../assets/css/less/entropy_skin_dark.less';
import '../assets/css/less/entropy_skin_light.less';
import '../assets/css/less/entropy_skin_pink.less';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { setConfig } from 'react-hot-loader';

import App from './app';
import history from './store/history';
import store from './store/configureStore';

import { config } from './config/config';

import Auth from './components/auth/Auth';
import { AUTH_USER } from './components/auth/actions/types';
import { requestUserInfo } from './components/user/UserActions';

import EntropyApi from './services/api/Entropy';

import 'core-js/es6/array';
import 'core-js/es6/promise';
import 'core-js/es6/object';

import 'jquery-ui-npm/jquery-ui.min';

require('bootstrap');

// require('./routes/discovery').default();

// CONFIGURACION REACT-HOT. Descomentar ignoreSFC para que funcione rapidamente.
// A veces no funciona completamente, porque no vuelve a cargar las librerias.
setConfig({
  // ignoreSFC: true,
  pureRender: true,
});

/* LIBRARY */
window.getStr = require('./helpers/TextHelper').getStr;

window.api = EntropyApi;

window.CancelToken = axios.CancelToken;
window.source = CancelToken.source();

axios.defaults.headers.common['x-authorization'] = config.apiAppKey;

const ELEMENT_TO_BOOTSTRAP = 'entropy-root';
const BootstrapedElement = document.getElementById(ELEMENT_TO_BOOTSTRAP);

/* Autentificacion del usuario */
if (Auth.isUserAuthenticated()) {
  const token = Auth.getToken();

  api.setToken(token);
  Auth.authenticateUser(token);
  store.dispatch({ type: AUTH_USER });
  requestUserInfo();
}

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <App history={history} />
    </Provider>,
    BootstrapedElement
  );
};

render();

export default hot(module)(render);
