import React from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';

import UiValidate from '../../../../components/forms/validation/UiValidate';
import {
  createPermission,
  getAllGroups,
  getPermissionData,
  updatePermissionData,
} from '../../../../components/user/UserActions';
import { errorMessage, successMessage } from '../../../../components/notifications/index';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

export default class PermissionForm extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    permissionId: PropTypes.number,
  };

  static defaultProps = {
    permissionId: null,
  };

  constructor(props) {
    super(props);
    this.pid = getStr();
    this.state = {
      permissionName: '',
      permissionLabel: '',
      group_id: '',
      groupList: false,
    };
  }

  componentDidMount() {
    this.startLoading();
    getAllGroups()
      .then((groupList) => {
        this.setState({
          groupList,
        });
        this.getPermissionInfo();
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.finishLoading();
      });
  }

  getPermissionInfo = () => {
    const { permissionId } = this.props;
    if (permissionId) {
      getPermissionData(permissionId)
        .then((info) => {
          this.setState({
            permissionName: info.permission,
            permissionLabel: info.label,
            group_id: info.group_id,
          });
        })
        .catch((error) => {
          const errorMsg = getErrorMessage(error);
          errorMessage('Error', errorMsg);
          this.finishLoading();
        });
    }
    this.finishLoading();
  };

  submit = (event) => {
    event.preventDefault();
    this.startLoading();
    const data = {
      permission: this.state.permissionName,
      label: this.state.permissionLabel,
      group_id: this.state.group_id,
    };
    const { permissionId } = this.props;
    const query = permissionId ? updatePermissionData : createPermission;

    query(data, permissionId)
      .then(() => {
        successMessage('Success', `Permission successfully ${permissionId ? 'edited' : 'created'}`, 5000);
        const { notify } = this.props || {};
        if (typeof notify === 'function') notify();
        this.finishLoading();
        this.removeTabNew();
      })
      .catch((error) => {
        console.log(error);
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

  handleSelect2 = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  removeTabNew = () => {
    setTimeout(() => {
      this.context.router.history.replace({
        pathname: '/admin/permissions/',
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
    const { groupList } = this.state;

    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.submit}>
          <fieldset>
            <label className="label">New Permission Information</label>
            <div className="row">
              <section className="col col-6">
                <label className="label">Name</label>
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.permissionName || ''}
                    onChange={this.handleChange}
                    name="permissionName"
                    placeholder="Permission name"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide the permission name</b>{' '}
                </label>
              </section>

              <section className="col col-6">
                <label className="label">Label</label>
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.permissionLabel || ''}
                    onChange={this.handleChange}
                    name="permissionLabel"
                    placeholder="Permission Label"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide label for the permission</b>{' '}
                </label>
              </section>

              <section className="col col-6">
                <label className="label">Group ID</label>
                {groupList && (
                  <Select2
                    name="group_id"
                    data={groupList.map((group) => {
                      return { text: group.name, id: group.id };
                    })}
                    value={this.state.group_id}
                    options={{
                      placeholder: 'Select group',
                    }}
                    onSelect={this.handleSelect2}
                    onUnselect={this.handleSelect2}
                    style={{ width: '100%' }}
                  />
                )}
              </section>
            </div>
          </fieldset>

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
