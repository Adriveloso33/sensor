import React from 'react';
import devicesApi from '../../../../../services/api/Devices';
import UiValidate from '../../../../../components/forms/validation/UiValidate';

import { errorMessage, successMessage, warningMessage } from '../../../../../components/notifications/index';
import { getErrorMessage } from '../../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../../components/scheduler/SchedulerActions';
import { checkAuthError } from '../../../../../components/auth/actions';
import ActionTypesForm from '../forms/actionTypes/ActionTypesForm';

export default class ActionTypesFormNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      saveLoading: false,
    };
    this.defaultValues = {};
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  submit = (event) => {
    event.preventDefault();
    const { devicesUrlInsert } = this.props || {};
    const data = {
      id: this.state.id,
      name: this.state.name,
    };
    this.startSaveLoading();
    devicesApi
      .create(devicesUrlInsert, data)
      .then(() => {
        successMessage('Success', 'Sensor successfully edited', 5000);
        this.finishSaveLoading();
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.finishSaveLoading();
      });
  };

  render() {
    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.submit}>
          <fieldset>
            <label className="label" style={{ fontSize: '1.7rem', padding: '10px' }}>
              {/* Action Type Edit ID: {this.state.id} */}
              Action Type NEW:
            </label>
            <div className="row">{this.formRender()}</div>
          </fieldset>

          <footer>
            <div className="text-right">
              {this.state.saveLoading && (
                <img className="loading-wdna" alt="loading" src="assets/img/loading-wdna.gif" />
              )}
              <button type="button" onClick={this.onReset} className="btn btn-primary">
                Reset
              </button>

              <button type="submit" onClick={this.onAdd} className="btn btn-primary">
                Save
              </button>
            </div>
          </footer>
        </form>
      </UiValidate>
    );
  }
}
