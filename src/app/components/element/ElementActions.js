/**
 * Created by griga on 11/24/15.
 */

import { config } from "../../config/config";
import Auth from "../auth/Auth";
import { logoutUser } from "../auth/actions";
import axios from "axios";

export const REQUEST_USER = "REQUEST_USER";
export const USER_INFO = "USER_INFO";
export const REMOVE_USER = "REMOVE_USER";

const UNKNOW_ERROR = "Unknow error";

export function getAllDomains() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/domain`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        let data = response.data;
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function getAllVendors(domainId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/vendor`, {
        params: {
          api_token: Auth.getToken(),
          nd_domain_id: domainId //quitar
        }
      })
      .then(response => {
        let data = response.data;
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function createVendor(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/discovery/vendor`, {
        api_token: Auth.getToken(),
        ...data
      })
      .then(response => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve("ok");
        }
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function deleteVendor(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/discovery/vendor/${id}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        resolve("ok");
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function updateVendorData(id, data) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/discovery/vendor/${id}`, {
        api_token: Auth.getToken(),
        ...data
      })
      .then(response => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve("ok");
        }
      })
      .catch(error => {
        reject(error.response.status);
      });
  });
}

export function getVendorData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/vendor/${id}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        let data = response.data;
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function getAllHwmodels(vendorId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/hwmodel`, {
        params: {
          api_token: Auth.getToken(),
          nd_vendor_id: vendorId //quitar
        }
      })
      .then(response => {
        let data = response.data;
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function createHwmodel(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/discovery/hwmodel`, {
        api_token: Auth.getToken(),
        ...data
      })
      .then(response => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve("ok");
        }
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function deleteHwmodel(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/discovery/hwmodel/${id}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        resolve("ok");
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function updateHwmodelData(id, data) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/discovery/hwmodel/${id}`, {
        api_token: Auth.getToken(),
        ...data
      })
      .then(response => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve("ok");
        }
      })
      .catch(error => {
        reject(error.response.status);
      });
  });
}

export function getHwmodelData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/hwmodel/${id}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        let data = response.data;
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function getAllSoftwares(vendorId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/software`, {
        params: {
          api_token: Auth.getToken(),
          nd_vendor_id: vendorId //quitar
        }
      })
      .then(response => {
        let data = response.data;
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function createSoftware(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/discovery/software`, {
        api_token: Auth.getToken(),
        ...data
      })
      .then(response => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve("ok");
        }
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function deleteSoftware(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/discovery/software/${id}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        resolve("ok");
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function updateSoftwareData(id, data) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/discovery/software/${id}`, {
        api_token: Auth.getToken(),
        ...data
      })
      .then(response => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve("ok");
        }
      })
      .catch(error => {
        reject(error.response.status);
      });
  });
}

export function getSoftwareData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/software/${id}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        let data = response.data;
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function getAllConfigs() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/config`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        let data = response.data;
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function createConfig(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/discovery/config`, {
        api_token: Auth.getToken(),
        ...data
      })
      .then(response => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve("ok");
        }
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function deleteConfig(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/discovery/config/${id}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        resolve("ok");
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

export function updateConfigData(id, data) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/discovery/config/${id}`, {
        api_token: Auth.getToken(),
        ...data
      })
      .then(response => {
        let data = response.data;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve("ok");
        }
      })
      .catch(error => {
        reject(error.response.status);
      });
  });
}

export function getConfigData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/discovery/config/${id}`, {
        params: {
          api_token: Auth.getToken()
        }
      })
      .then(response => {
        let data = response.data;
        resolve(data);
      })
      .catch(error => {
        reject(error.response);
      });
  });
}

function validatorHandler(validator) {
  for (let key in validator) {
    let error = validator[key];

    if (error.length) return error[0];
  }

  return UNKNOW_ERROR;
}
