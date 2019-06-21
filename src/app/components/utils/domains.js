import React from 'react';
import axios from 'axios';

import Auth from '../auth/Auth';
import { config } from '../../config/config';

const apiUrl = config.apiRootUrl;
const sitesUrl = `${apiUrl}/discovery/site`;
const msoUrl = `${apiUrl}/discovery/mso`;

/**
 * Returns the domain list for the app
 * @returns {Array} domainsList
 */
export function getAllDomains() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/domain`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then((response) => {
        let data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

/**
 * Returns the domain id for a given domain code
 * @param {String} domainCode
 * @returns {Number} domainId
 */
export function getDomainId(domainCode) {
  return new Promise((resolve, reject) => {
    getAllDomains()
      .then((domains) => {
        let found = false;
        domains &&
          domains.forEach((domain) => {
            let { cod, id } = domain;

            found = found || (cod == domainCode ? id : false);
          });
        if (found) resolve(found);
        else reject('Domain not found');
      })
      .catch((err) => {
        reject('Error retriving data form server');
      });
  });
}

/**
 * Returns the subdomain id for a given subdomain code
 * @param {String} domainCode
 * @returns {Number} domainId
 */
export function getSubDomainId(subDomainCode) {
  return new Promise((resolve, reject) => {
    getAllDomains()
      .then((domains) => {
        let found = false;
        domains &&
          domains.forEach((domain) => {
            let { subdomain, subdomain_id } = domain;

            found = found || (subdomain == subDomainCode ? subdomain_id : false);
          });
        if (found) resolve(found);
        else reject('Sub domain not found');
      })
      .catch((err) => {
        reject('Error retriving data form server');
      });
  });
}

/**
 * Returns the vendors list for a given domain id
 * @param {Number} domainId
 * @returns {Array} vendorList
 */
export function getDomainVendors(domainId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/vendor`, {
        params: {
          api_token: Auth.getToken(),
          nd_domain_id: domainId
        }
      })
      .then((response) => {
        let data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

/**
 * Returns the hw models for a given vendor id
 * @param {Number} vendorId
 * @returns {Array} hwModels List
 */
export function getVendorHwModels(vendorId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/hwmodel`, {
        params: {
          api_token: Auth.getToken(),
          nd_vendor_id: vendorId
        }
      })
      .then((response) => {
        let data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

/**
 * Returns the entire software model list
 * @returns {Array} software Models
 */
export function getSoftwareList() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/software`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then((response) => {
        let data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

/**
 * Returns the Rollback files for a given domain
 * @param {String} domainCode
 * @returns {Array} list
 */
export function getRollbackFiles(domainCode, subDomainCode) {
  return new Promise((resolve, reject) => {
    getAllRollbackFiles()
      .then((fileList) => {
        getDomainId(domainCode)
          .then((domainId) => {
            if (typeof subDomainCode !== 'undefined') {
              getSubDomainId(subDomainCode)
                .then((subDomainId) => {
                  let files = fileList.filter(
                    (file) => file.nd_domain_id == domainId && file.nd_subdomain_id == subDomainId
                  );
                  resolve(files);
                })
                .catch((err) => {
                  reject('Error retriving sub Domain id data from server');
                });
            } else {
              let files = fileList.filter((file) => file.nd_domain_id == domainId);
              resolve(files);
            }
          })
          .catch((err) => {
            reject('Error retriving Domain id data from server');
          });
      })
      .catch((err) => {
        reject('Error retriving Rollback data from server');
      });
  });
}

/**
 * Returns all the Rollback files stored in server
 * @param {String} domainCode
 * @returns {Array} list
 */
export function getAllRollbackFiles() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/rollback`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then((response) => {
        let data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

/**
 * Returns the grid config for a given domain code
 * @returns {Object} config
 */
export function getGridConfig(domainCode) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/config`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then((response) => {
        let data = response.data;

        let config = data.filter((elem) => elem.domain == domainCode);

        resolve(config);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

/**
 * Returns all the sites
 * @returns {Array} siteList
 */
export function getAllSites() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${sitesUrl}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then((response) => {
        let data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

/**
 * Returns all the mso
 * @returns {Array} msoList
 */
export function getAllMsos() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${sitesUrl}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then((response) => {
        let data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}
