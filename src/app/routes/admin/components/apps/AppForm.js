import React from 'react';
import PropTypes from 'prop-types';
import UiValidate from '../../../../components/forms/validation/UiValidate';

import { createApp, getAppData, updateAppData } from '../../../../components/user/UserActions';
import { errorMessage, successMessage } from '../../../../components/notifications/index';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

export default class AppForm extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    appId: PropTypes.number,
  };

  static defaultProps = {
    appId: null,
  };

  constructor(props) {
    super(props);
    this.pid = getStr();
    this.state = {
      appName: '',
    };
  }

  componentDidMount() {
    const { appId } = this.props;
    if (appId) {
      this.startLoading();
      getAppData(appId)
        .then((appInfo) => {
          this.setState({
            appName: appInfo.name,
          });
          this.finishLoading();
        })
        .catch((error) => {
          const errorMsg = getErrorMessage(error);
          errorMessage('Error', errorMsg);
          this.finishLoading();
        });
    }
  }

  submit = (event) => {
    event.preventDefault();
    const data = {
      name: this.state.appName,
    };
    const { appId } = this.props;
    const query = appId ? updateAppData : createApp;

    query(data, appId)
      .then(() => {
        successMessage('Success', `App successfully ${appId ? 'edited' : 'created'}`, 5000);
        const { notify } = this.props || {};
        if (typeof notify === 'function') notify();
        this.removeTabNew();
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
      });
  };

  handleChange = (event) => {
    this.setState({
      appName: event.target.value,
    });
  };

  removeTabNew = () => {
    setTimeout(() => {
      this.context.router.history.replace({
        pathname: '/admin/apps/',
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
    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.submit}>
          <fieldset>
            <label className="label">App Information</label>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.appName || ''}
                    onChange={this.handleChange}
                    name="appName"
                    placeholder="app name"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide the app name</b>{' '}
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
