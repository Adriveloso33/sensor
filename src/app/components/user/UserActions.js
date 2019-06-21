import api from '../../services/api/Entropy';
import { logoutUser } from '../auth/actions';

import axios from 'axios';
import Auth from '../../components/auth/Auth';

import { config } from '../../config/config';

export const REQUEST_USER = 'REQUEST_USER';
export const USER_INFO = 'USER_INFO';
export const REMOVE_USER = 'REMOVE_USER';

const UNKNOW_ERROR = 'Unknow error';

export function requestUserInfo() {
  return api
    .get('myinfo')
    .then((user) => {
      store.dispatch({
        type: USER_INFO,
        data: { ...user, picture: 'assets/img/avatars/sunny.png' },
      });
    })
    .catch(() => {
      logoutUser();
    });
}

export function removeUserInfo() {
  store.dispatch({
    type: REMOVE_USER,
  });
}

export function hasRole(roleStr) {
  const user = store.getState().getIn(['user']);

  if (!user || !user.role) return false;

  const role = user.role;

  return roleStr === role.name;
}

export function hasPermission(permissionStr) {
  let user = store.getState().getIn(['user']);

  if (!user || !user.role) return false;

  let role = user.role;
  let permissions = role.role_permissions;
  let result = false;

  permissions &&
    permissions.forEach((elem) => {
      let p = elem.permission ? elem.permission.permission : '';
      result = result || p === permissionStr;
    });

  return result;
}

export function hasOnePermission(permissionsList) {
  let user = store.getState().getIn(['user']);

  if (!user || !user.role || !permissionsList) return false;

  let role = user.role;
  let permissions = role.role_permissions;
  let result = false;

  permissions &&
    permissions.forEach((elem) => {
      let p = elem.permission ? elem.permission.permission : '';
      result = result || permissionsList.indexOf(p) != -1;
    });

  return result;
}

export function updatePassword(data) {
  return new Promise((resolve, reject) => {
    api
      .post('password', {
        ...data,
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getLoggedUserInfo() {
  return new Promise((resolve, reject) => {
    api
      .get('myinfo')
      .then((userInfo) => {
        resolve(userInfo);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getUserList() {
  return new Promise((resolve, reject) => {
    api
      .get('users')
      .then((userList) => {
        resolve(userList);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getUserData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/users/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function createUser(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/users`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response);
      });
  });
}

export function updateUserData(data, id) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/users/${id}`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response.status);
      });
  });
}

export function deleteUser(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/users/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        resolve('ok');
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

export function getAllRoles() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/roles`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function getAllPermissions() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/permissions`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function createRole(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/roles`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response);
      });
  });
}

export function deleteRole(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/roles/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        resolve('ok');
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

export function updateRoleData(data, id) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/roles/${id}`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response.status);
      });
  });
}

export function getRoleData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/roles/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function getAllAreas() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/areas`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function createArea(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/areas`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response);
      });
  });
}

export function deleteArea(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/areas/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        resolve('ok');
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

export function updateAreaData(data, id) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/areas/${id}`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response.status);
      });
  });
}

export function getAreaData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/areas/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function createPermission(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/permissions`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response);
      });
  });
}

export function deletePermission(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/permissions/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        resolve('ok');
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

export function updatePermissionData(data, id) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/permissions/${id}`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response.status);
      });
  });
}

export function getPermissionData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/permissions/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function getAllDepartments() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/departments`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function createDepartment(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/departments`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response);
      });
  });
}

export function deleteDepartment(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/departments/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        resolve('ok');
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

export function updateDepartmentData(data, id) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/departments/${id}`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response.status);
      });
  });
}

export function getDepartmentData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/departments/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function getAllGroups() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/groups`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function createGroup(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/groups`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response);
      });
  });
}

export function deleteGroup(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/groups/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        resolve('ok');
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

export function updateGroupData(data, id) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/groups/${id}`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response.status);
      });
  });
}

export function getGroupData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/groups/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function getAllApps() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/apps`, {
        params: {
          api_token: Auth.getToken(),
        },
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

export function createApp(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.apiRootUrl}/apps`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response);
      });
  });
}

export function deleteApp(id) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${config.apiRootUrl}/apps/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
      })
      .then((response) => {
        resolve('ok');
      })
      .catch((error) => {
        reject(error.response);
      });
  });
}

export function updateAppData(data, id) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${config.apiRootUrl}/apps/${id}`, {
        api_token: Auth.getToken(),
        ...data,
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
        reject(error.response.status);
      });
  });
}

export function getAppData(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.apiRootUrl}/apps/${id}`, {
        params: {
          api_token: Auth.getToken(),
        },
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

function validatorHandler(validator) {
  for (let key in validator) {
    let error = validator[key];

    if (error.length) return error[0];
  }

  return UNKNOW_ERROR;
}
