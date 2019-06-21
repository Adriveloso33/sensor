import React from 'react';
import PropTypes from 'prop-types';
import UiValidate from '../../../../components/forms/validation/UiValidate';

import { createArea, getAreaData, updateAreaData } from '../../../../components/user/UserActions';
import { errorMessage, successMessage } from '../../../../components/notifications/index';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

export default class AreaForm extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    areaId: PropTypes.number,
  };

  static defaultProps = {
    areaId: null,
  };

  constructor(props) {
    super(props);

    this.pid = getStr();
    this.state = {
      areaName: '',
      areaAcronym: '',
    };
  }

  componentDidMount() {
    const { areaId } = this.props;
    if (areaId) {
      this.startLoading();
      getAreaData(areaId)
        .then((areaInfo) => {
          this.setState({
            areaName: areaInfo.name,
            areaAcronym: areaInfo.acronym,
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
      name: this.state.areaName,
      acronym: this.state.areaAcronym,
    };
    const { areaId } = this.props;
    const query = areaId ? updateAreaData : createArea;

    query(data, areaId)
      .then(() => {
        successMessage('Success', `Area successfully ${areaId ? 'edited' : 'created'}`, 5000);
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
        pathname: '/admin/areas/',
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
            <label className="label">Area Information</label>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.areaName || ''}
                    onChange={this.handleChange}
                    name="areaName"
                    placeholder="Area name"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide the area name</b>{' '}
                </label>
              </section>

              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-info-circle" />
                  <input
                    type="text"
                    value={this.state.areaAcronym || ''}
                    onChange={this.handleChange}
                    name="areaAcronym"
                    placeholder="Area acronym"
                  />
                  <b className="tooltip tooltip-bottom-right">Provide acronym for the area</b>{' '}
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
