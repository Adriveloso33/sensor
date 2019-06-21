import React from 'react';
import devicesApi from '../../../../../services/api/Devices';
import UiValidate from '../../../../../components/forms/validation/UiValidate';

import { errorMessage, successMessage, warningMessage } from '../../../../../components/notifications/index';
import { getErrorMessage } from '../../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../../components/scheduler/SchedulerActions';
import { checkAuthError } from '../../../../../components/auth/actions';

export default class SensorsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      saveLoading: false,
    };
    this.defaultValues = {};
  }

  componentDidMount = () => {
    this.initData();
  };

  initData = () => {
    const { devicesUrlGet, rowId } = this.props || {};
    this.startLoading();
    devicesApi
      .get(devicesUrlGet, {
        id: rowId,
      })
      .then((response) => {
        if (response) {
          this.setState({ ...response }, () => {
            this.defaultValues = _.cloneDeep(this.state);
          });
        } else {
          warningMessage('Warning', 'There is no data for the grid.');
        }
        this.finishLoading();
      })
      .catch((err) => {
        console.log(err);
        if (!axios.isCancel(err) && !checkAuthError(err)) errorMessage('Error', 'Error while retrieving form data.');
        this.finishLoading();
      });
  };

  startLoading = () => {
    this.setState({
      loading: true,
    });
    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    this.setState({
      loading: false,
    });
    store.dispatch(finishProcess(this.pid));
  };

  startSaveLoading = () => {
    this.setState({
      saveLoading: true,
    });
  };

  finishSaveLoading = () => {
    this.setState({
      saveLoading: false,
    });
  };

  onReset = () => {
    this.setState({
      ...this.defaultValues,
    });
  };

  submit = (event) => {
    event.preventDefault();
    const { devicesUrlInsert } = this.props || {};
    const data = _.cloneDeep(this.state);
    this.startSaveLoading();
    devicesApi
      .post(devicesUrlInsert, data)
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

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  formItemsRender = (rowKey) => {
    const name = `${rowKey}`;
    const placeholder = `${rowKey}`;
    const label = `${rowKey}`;
    const value = this.state[name];
    if (name === 'company_id' || name === 'open' || name === 'shared') {
      return (
        <section key={rowKey} className="col col-3">
          <label className="label">{label}</label>
          <label className="input">
            <input type="text" value={value} onChange={this.handleChange} name={name} placeholder={placeholder} />
            <b className="tooltip tooltip-bottom-right">Provide {name}</b>
          </label>
        </section>
      );
    }
  };

  formRender = () => {
    const render = [];
    Object.entries(this.state).forEach(([rowKey]) => {
      render.push(this.formItemsRender(rowKey));
    });

    return render;
  };

  render() {
    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.submit}>
          <fieldset>
            <label className="label" style={{ fontSize: '1.7rem', padding: '10px' }}>
              Sensor Edit ID: {this.state.id}
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
