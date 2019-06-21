import React from 'react';
import PropTypes from 'prop-types';

import UiValidate from '../../../../components/forms/validation/UiValidate';
import {
  getAllPermissions,
  createRole,
  getAllGroups,
  getRoleData,
  updateRoleData,
} from '../../../../components/user/UserActions';
import { PermissionsRow } from './PermissionsRow';
import { errorMessage, successMessage } from '../../../../components/notifications/index';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

export default class RoleForm extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    roleId: PropTypes.number,
  };

  static defaultProps = {
    roleId: null,
  };

  constructor(props) {
    super(props);
    this.pid = getStr();
    this.rolePermissions = [];
    this.state = {
      permissionList: [],
      groupList: false,
      groupNames: false,

      roleName: '',
      roleDesc: '',
    };
  }

  componentDidMount() {
    this.startLoading();
    getAllPermissions()
      .then((permissionList) => {
        const groupList = this.getGroupList(permissionList);
        this.getRoleInfo(permissionList);
        this.setState({ groupList }, this.getGroupsNames);
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.finishLoading();
      });
  }

  getGroupsNames = () => {
    getAllGroups()
      .then((groups) => {
        this.setState({
          groupNames: groups,
        });
      })
      .catch((error) => {
        console.log(error);
        errorMessage('Error', 'Error retrieving the groups list from server');
        this.finishLoading();
      });
  };

  getRoleInfo = (permissionList) => {
    const { roleId } = this.props;
    if (roleId) {
      getRoleData(roleId)
        .then((info) => {
          this.activatePermissions(info.role_permissions, permissionList);
          this.setState({
            roleName: info.name,
            roleDesc: info.description,
          });
        })
        .catch((error) => {
          console.log(error);
          const errorMsg = getErrorMessage(error);
          errorMessage('Error', errorMsg);
          this.finishLoading();
        });
    } else {
      this.setState({ permissionList });
    }
    this.finishLoading();
  };

  activatePermissions = (rolePerms, permissionList) => {
    const permList = _.cloneDeep(permissionList);
    rolePerms.forEach((perm) => {
      const permId = perm.permission_id;
      const idx = permissionList.findIndex((el) => {
        return permId === el.id;
      });
      if (idx >= 0) permList[idx].checked = true;
    });
    this.setState({
      permissionList: permList,
    });
  };

  submit = (event) => {
    event.preventDefault();
    this.startLoading();
    const permissions = this.rolePermissions;
    const data = {
      name: this.state.roleName,
      description: this.state.roleDesc,
    };
    permissions.forEach((perm) => {
      data[perm] = 1;
    });
    const { roleId } = this.props;
    const query = roleId ? updateRoleData : createRole;

    query(data, roleId)
      .then(() => {
        successMessage('Success', `Role successfully ${roleId ? 'edited' : 'created'}`, 5000);
        const { notify } = this.props || {};
        if (typeof notify === 'function') notify();
        this.finishLoading();
        this.removeTabNew();
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.finishLoading();
      });
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  hasPerm = (list, perm) => {
    if (list && list.lenght !== 0) {
      return list.indexOf(perm) !== -1;
    }
  };

  handlePermission = (event) => {
    const value = event.target.checked;
    const { name } = event.target;
    const newList = this.rolePermissions;
    if (value === true) {
      // added if not exist
      if (!this.hasPerm(newList, name)) newList.push(name);
    } else if (this.hasPerm(newList, name)) {
      newList.splice(newList.indexOf(name), 1);
    }
  };

  getGroupList = (permissionList) => {
    const list = [];
    const mark = new Map();
    permissionList.forEach((perm) => {
      const groupId = perm.group_id;
      if (!mark.get(groupId)) {
        mark.set(groupId, true);
        list.push(groupId);
      }
    });

    if (list) list.sort((a, b) => a - b);
    return list;
  };

  getGroupLabel = (groupId) => {
    const { groupNames } = this.state;
    if (groupNames) {
      const group = groupNames.find((g) => g.id === groupId);
      if (group) return group.name;
    }
    return false;
  };

  removeTabNew = () => {
    setTimeout(() => {
      this.context.router.history.replace({
        pathname: '/admin/roles/',
      });
    }, 200);
  };

  startLoading = () => {
    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    store.dispatch(finishProcess(this.pid));
  };

  render() {
    const { groupList, groupNames } = this.state;
    const { permissionList } = this.state;
    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.submit}>
          <fieldset>
            <label className="label">New Role Information</label>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.roleName || ''}
                    onChange={this.handleChange}
                    name="roleName"
                    placeholder="Role name"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide the role name</b>{' '}
                </label>
              </section>

              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.roleDesc || ''}
                    onChange={this.handleChange}
                    name="roleDesc"
                    placeholder="Role description"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide a description for the role</b>{' '}
                </label>
              </section>
            </div>
          </fieldset>

          <fieldset>
            <h3>Permissions</h3>
          </fieldset>

          {groupList &&
            groupNames &&
            groupList.map((groupId, index) => (
              <PermissionsRow
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                group={groupId}
                label={this.getGroupLabel(groupId)}
                handleChange={this.handlePermission}
                permissionList={permissionList}
              />
            ))}

          <footer>
            <div className="text-right">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </footer>
        </form>
      </UiValidate>
    );
  }
}
