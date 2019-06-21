import React from 'react';
import PropTypes from 'prop-types';
import UiValidate from '../../../../components/forms/validation/UiValidate';

import { errorMessage, successMessage } from '../../../../components/notifications/index';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { createDepartment, updateDepartmentData } from '../../../../components/user/UserActions';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

import InlineSensorSelector from '../sensorSelector/InlineSensorSelector';
import DatePicker from '../../../../components/datepicker/DatePicker';

export default class ReadingsForm extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.pid = getStr();
    this.state = {};
  }

  componentDidMount() {
    this.initData();
  }

  initData = () => {
    const { row } = this.props;

    this.setState({ ...row }, () => {});
  };

  submit = (event) => {
    event.preventDefault();
    this.startLoading();
    const data = {
      id: this.state.id,
      name: this.state.name,
    };
    const { Id } = this.props;
    const query = Id ? updateDepartmentData : createDepartment;

    query(data, Id)
      .then(() => {
        successMessage('Success', `Reading successfully ${Id ? 'edited' : 'created'}`, 5000);

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

  removeTabNew = () => {
    setTimeout(() => {
      this.context.router.history.replace({
        pathname: '/readings',
      });
    }, 200);
  };

  startLoading = () => {
    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    store.dispatch(finishProcess(this.pid));
  };

  formItemsRender = (rowKey) => {
    const name = `${rowKey}`;
    const placeholder = `${rowKey}`;
    const label = `${rowKey}`;
    const value = this.state[name];

    if (name === 'Action' || name === 'Id') return;
    if (name === 'Sensor') {
      return (
        <section key={rowKey} className="col col-6">
          <label className="label">{label}</label>
          <label className="input">
            <InlineSensorSelector />
          </label>
        </section>
      );
    }

    if (name === 'Date') {
      const defaultDateFormat = 'DD-MM-YYYY';
      return (
        <section className="col col-3">
          <label className="label">{label}</label>
          <label className="input">
            <DatePicker
              showIcon={false}
              showTimePicker
              value={this.state.date}
              onChange={this.handleDatePicker}
              groupDateTime="24h"
              options={{
                mode: 'single',
                dateFormat: 'd-m-Y',
                locale: {
                  firstDayOfWeek: 1, // start week on Monday
                },
                minDate: moment()
                  .add('-1', 'years')
                  .format(defaultDateFormat),
              }}
            />
          </label>
        </section>
      );
    }
    if (name === 'String') {
      return (
        <section key={rowKey} className="col col-6">
          <label className="label">{label}</label>
          <label className="input">
            <input type="text" value={value} onChange={this.handleChange} name={name} placeholder={placeholder} />
            <b className="tooltip tooltip-bottom-right">Provide {rowKey} data</b>
          </label>
        </section>
      );
    }

    return (
      <section key={rowKey} className="col col-3">
        <label className="label">{label}</label>
        <label className="input">
          <input type="text" value={value} onChange={this.handleChange} name={name} placeholder={placeholder} />
          <b className="tooltip tooltip-bottom-right">Provide {rowKey} data</b>
        </label>
      </section>
    );
  };

  formRender = () => {
    const { row = {} } = this.props || {};
    const render = [];

    Object.entries(row).forEach(([rowKey]) => {
      render.push(this.formItemsRender(rowKey));
    });

    return render;
  };

  render() {
    const { row = {} } = this.props || {};

    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.submit}>
          <fieldset>
            <label className="label" style={{ fontSize: '1.7rem', padding: '10px' }}>
              Readings Edit ID: {row.Id}
            </label>
            <div className="row">{this.formRender()}</div>
          </fieldset>

          <footer>
            <div className="text-right">
              <button type="button" className="btn btn-primary">
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

ReadingsForm.propTypes = {
  row: PropTypes.object.isRequired,
  Id: PropTypes.number.isRequired,
};
