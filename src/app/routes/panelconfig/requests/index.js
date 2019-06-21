import React from 'react';
import axios from 'axios';
import Auth from '../../../components/auth/Auth';
import { config } from '../../../config/config';

export function getItems() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/entropy/panelconfig`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        const { data } = response;

        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteItem(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/entropy/panelconfig/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function addShortcutRequest(id) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/panelshortcut`, {
        api_token: Auth.getToken(),
        id,
      })
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteShortcutRequest(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/entropy/panelshortcut/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
