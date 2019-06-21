import React from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';

import UiValidate from '../../../../components/forms/validation/UiValidate';
import { createGroup, getAllApps, getGroupData, updateGroupData } from '../../../../components/user/UserActions';
import { errorMessage, successMessage } from '../../../../components/notifications/index';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

export default class GroupForm extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    groupId: PropTypes.number,
  };

  static defaultProps = {
    groupId: null,
  };

  constructor(props) {
    super(props);
    this.pid = getStr();
    this.state = {
      groupName: '',
      groupAppId: '',
      appList: [],
    };
  }

  componentDidMount() {
    this.startLoading();
    getAllApps()
      .then((appList) => {
        this.setState({
          appList,
        });
        this.getGroupInfo();
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.finishLoading();
      });
  }

  getGroupInfo = () => {
    const { groupId } = this.props;
    if (groupId) {
      getGroupData(groupId)
        .then((info) => {
          this.setState({
            groupName: info.name,
            groupAppId: info.app_id,
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
      name: this.state.groupName,
      app_id: this.state.groupAppId,
    };
    const { groupId } = this.props;
    const query = groupId ? updateGroupData : createGroup;

    query(data, groupId)
      .then(() => {
        successMessage('Success', `Group successfully ${groupId ? 'edited' : 'created'}`, 5000);
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
    this.state.groupAppId = value;
  };

  removeTabNew = () => {
    setTimeout(() => {
      this.context.router.history.replace({
        pathname: '/admin/groups/',
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
    const { appList } = this.state;
    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.submit}>
          <fieldset>
            <label className="label">New Group Information</label>

            <div className="row">
              <section className="col col-6">
                <label className="label">Group Name</label>
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.groupName || ''}
                    onChange={this.handleChange}
                    name="groupName"
                    placeholder="Group name"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide the group name</b>{' '}
                </label>
              </section>

              <section className="col col-6">
                <label className="label">App id</label>
                <label className="input">
                  {' '}
                  {appList && (
                    <Select2
                      name="groupAppId"
                      data={appList.map((app) => {
                        return { text: app.name, id: app.id };
                      })}
                      value={this.state.groupAppId}
                      options={{
                        placeholder: 'Select app',
                      }}
                      onSelect={this.handleSelect2}
                      onUnselect={this.handleSelect2}
                      style={{ width: '100%' }}
                    />
                  )}
                  <b className="tooltip tooltip-bottom-right">Provide the app</b>{' '}
                </label>
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
