import React from 'react';
import PropTypes from 'prop-types';
import UiValidate from '../../../../components/forms/validation/UiValidate';

import { errorMessage, successMessage } from '../../../../components/notifications/index';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { createDepartment, getDepartmentData, updateDepartmentData } from '../../../../components/user/UserActions';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

export default class DepartmentForm extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    departmentId: PropTypes.number,
  };

  static defaultProps = {
    departmentId: null,
  };

  constructor(props) {
    super(props);

    this.pid = getStr();
    this.state = {
      departmentName: '',
      departmentCode: '',
    };
  }

  componentDidMount() {
    const { departmentId } = this.props;
    if (departmentId) {
      this.startLoading();
      getDepartmentData(departmentId)
        .then((info) => {
          this.setState({
            departmentName: info.name,
            departmentCode: info.code,
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
    this.startLoading();
    const data = {
      name: this.state.departmentName,
      code: this.state.departmentCode,
    };
    const { departmentId } = this.props;
    const query = departmentId ? updateDepartmentData : createDepartment;

    query(data, departmentId)
      .then(() => {
        successMessage('Success', `Department successfully ${departmentId ? 'edited' : 'created'}`, 5000);

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
        pathname: '/admin/departments/',
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
            <label className="label">Department Information</label>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.departmentName || ''}
                    onChange={this.handleChange}
                    name="departmentName"
                    placeholder="Department name"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide the department name</b>{' '}
                </label>
              </section>

              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.departmentCode || ''}
                    onChange={this.handleChange}
                    name="departmentCode"
                    placeholder="Department Code"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide code for the department</b>{' '}
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
