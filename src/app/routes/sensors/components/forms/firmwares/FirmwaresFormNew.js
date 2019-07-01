import React from 'react';
import devicesApi from '../../../../../services/api/Devices';
import UiValidate from '../../../../../components/forms/validation/UiValidate';

import { errorMessage, successMessage, warningMessage } from '../../../../../components/notifications/index';
import { getErrorMessage } from '../../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../../components/scheduler/SchedulerActions';
import { checkAuthError } from '../../../../../components/auth/actions';

export default class FirmwareFormNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      saveLoading: false,
      file: '',
    };
    this.defaultValues = {};
  }

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

  handleClick = (e) => {
    console.log('Button was clicked');
  };

  handleChange = (event) => {
    //const { value, name } = event.target;
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  submit = (event) => {
    event.preventDefault();
    const { devicesUrlInsert } = this.props || {};
    //const data = _.cloneDeep(this.state);
    const data = {
      id: this.getRandomInt(),
      file: this.state.file,
    };
    this.startSaveLoading();
    devicesApi
      .post(devicesUrlInsert, data)
      .then(() => {
        successMessage('Success', 'Sensor successfully created', 5000);
        this.finishSaveLoading();
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.finishSaveLoading();
      });
  };

  getRandomInt = () => {
    const number = (Math.random() * 1000).toFixed(0);
    return parseInt(number, 10);
  };

  formItemsRender = (rowKey) => {
    const name = `${rowKey}`;
    const placeholder = `${rowKey}`;
    const label = `${rowKey}`;
    const value = this.state[name];
    if (name === 'id') return null;
    if (name === 'loading') return null;
    if (name === 'saveLoading') return null;
    return (
      <section key={rowKey} className="col col-3">
        <label className="label">{label}</label>
        <label className="input">
          <input type="text" value={value} onChange={this.handleChange} name={name} placeholder={placeholder} />
          <b className="tooltip tooltip-bottom-right">Provide {name}</b>
        </label>
      </section>
    );
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
              Firmware New
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

              <button type="submit" onClick={this.handleClick} className="btn btn-primary">
                Save
              </button>
            </div>
          </footer>
        </form>
      </UiValidate>
    );
  }
}
