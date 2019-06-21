import Auth from '../../../components/auth/Auth';
import { config } from '../../../config/config';
import { validatorHandler } from '../../../helpers/requests/ErrorHandler';

export function getSpecialEventsList() {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/spe/getspelist`, {
        api_token: Auth.getToken(),
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function vendorsRequest() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/entropy/getvendor`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        const { data } = response || {};
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function familyLevelRequest(vendor_id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/entropy/getfamilylevelidcell`, {
        params: {
          api_token: Auth.getToken(),
          vendor_id: vendor_id,
        },
      })
      .then((response) => {
        const { data } = response || {};
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        }
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function networkFiltersRequest(vendor_id, region_id, familyLevel, filterLevel) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/gridnetwork`, {
        api_token: Auth.getToken(),
        vendor_id: vendor_id,
        region_id: region_id,
        family_level: familyLevel,
        filter_level: filterLevel,
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getNumberOfGraphs(vendor) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/spe/numdashboardgraphs`, {
        api_token: Auth.getToken(),
        vendor,
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getSpecialEventChart(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/spe/chart`,
        {
          api_token: Auth.getToken(),
          ...params,
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getFilterLevels(params) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/entropy/spe/filter`, {
        params: {
          api_token: Auth.getToken(),
          ...params,
        },
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getFilterData(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/spe/filterdata`, {
        api_token: Auth.getToken(),
        ...params,
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getGridData(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${config.apiRootUrl}/entropy/spe/grid`,
        {
          api_token: Auth.getToken(),
          ...params,
        },
        { cancelToken: source.token }
      )
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getGroupLevels(params) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/entropy/spe/grouplevel`, {
        params: {
          api_token: Auth.getToken(),
          ...params,
        },
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getKpisForSpecialEvent(vendor) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/entropy/spe/listkpitable`, {
        params: {
          vendor,
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getCheckNetworkElementsData(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/spe/gridcheckne`, {
        api_token: Auth.getToken(),
        ...params,
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getNEforMasterList(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/spe/elementspe`, {
        api_token: Auth.getToken(),
        ...params,
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function insertSPE(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/spe/insert`, {
        api_token: Auth.getToken(),
        ...params,
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteSPE(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/spe/delete`, {
        api_token: Auth.getToken(),
        ...params,
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function editSPE(params) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/entropy/spe/edit`, {
        api_token: Auth.getToken(),
        ...params,
      })
      .then((response) => {
        const { data } = response;
        if (data.validator) {
          return reject(validatorHandler(data.validator));
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}
