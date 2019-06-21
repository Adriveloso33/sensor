import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import PropTypes from 'prop-types';

import axios from 'axios';
import HtmlRender from '../../../../components/utils/HtmlRender';
import UiValidate from '../../../../components/forms/validation/UiValidate';

import { config } from '../../../../config/config';
import Auth from '../../../../components/auth/Auth';

import { registerUser } from '../../../../components/auth/actions';
import { getUserData, updateUserData, getAllDepartments } from '../../../../components/user/UserActions';
import countries from '../../../../components/forms/commons/countries';
import Select2 from 'react-select2-wrapper';

export default class JobInfoById extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      department_users_id: '',
      job_company: '',
      job_email: '',
      job_telephone: '',
      job_telephone_alt: '',
      job_address: '',
      job_cp: '',
      job_city: '',
      job_province: '',
      job_country: '',

      loading: false,
      saved: false,
      dontsaved: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    countries,
  };

  componentDidMount() {
    getUserData(this.props.id)
      .then((userData) => {
        this.parseUserData(userData);
      })
      .catch((error) => {});

    getAllDepartments()
      .then((departmentList) => {
        this.setState({
          departmentList,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  parseUserData = (user) => {
    let { email, name } = user;
    let {
      department_users_id,
      job_company,
      job_email,
      job_telephone,
      job_telephone_alt,
      job_address,
      job_cp,
      job_city,
      job_province,
      job_country,
    } = user.job || {};

    this.setState({
      ...user.job,
    });
  };

  handleFormSubmit(event) {
    event.preventDefault();
    this.loadingStart();

    this.updateUserJob();
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSelect2 = (event) => {
    const element = event.target;
    const value = element.value;
    const name = element.name;

    this.setState({
      [name]: value,
    });
  };

  sanitizeData = (data) => {
    for (let key in data) {
      if (data[key] === null || data[key] == '') delete data[key];
    }
  };

  updateUserJob = () => {
    let id = this.props.id;
    let {
      department_users_id,
      job_company,
      job_email,
      job_telephone,
      job_telephone_alt,
      job_address,
      job_cp,
      job_city,
      job_province,
      job_country,
    } = this.state;

    let data = {
      department_users_id,
      job_company,
      job_email,
      job_telephone,
      job_telephone_alt,
      job_address,
      job_cp,
      job_city,
      job_province,
      job_country,
    };

    this.sanitizeData(data);

    updateUserData(data, id)
      .then((response) => {
        this.loadingFinish();
        this.dataSaved();

        setTimeout(() => {
          this.context.router.goBack();
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
        this.loadingFinish();
        this.dataDontSaved(error);
      });
  };

  loadingStart() {
    this.setState({ loading: true, saved: false, dontsaved: false });
  }

  loadingFinish() {
    this.setState({ loading: false });
  }

  dataSaved() {
    this.setState({ saved: true });
  }

  dataDontSaved(error) {
    this.setState({ dontsaved: error || true });
  }

  render() {
    let { departmentList } = this.state;
    return (
      <UiValidate>
        <form id="user-form" className="smart-form">
          {this.props.saved && (
            <div className="alert alert-success fade in">
              <button className="close" data-dismiss="alert">
                ×
              </button>
              <i className="fa-fw fa fa-check" />
              <strong> Success!</strong> Data saved successful.
            </div>
          )}
          {this.props.dontsaved && (
            <div className="alert alert-danger fade in">
              <button className="close" data-dismiss="alert">
                ×
              </button>
              <i className="fa-fw fa fa-warning" />
              <strong> Error</strong> {this.props.dontsaved}
            </div>
          )}
          <fieldset>
            <label className="label">User Department</label>
            <div className="row">
              <section className="col col-6">
                {departmentList && (
                  <Select2
                    name="department_user_id"
                    data={departmentList.map((department) => {
                      return { text: department.name, id: department.id };
                    })}
                    value={this.props.department_user_id}
                    options={{
                      placeholder: 'Select user department',
                    }}
                    onSelect={this.props.handleSelect2}
                    onUnselect={this.props.handleSelect2}
                    style={{ width: '100%' }}
                  />
                )}
              </section>
            </div>
          </fieldset>
          <fieldset>
            <label className="label">Datos laborales</label>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-envelope" />
                  <input
                    type="text"
                    value={this.props.job_company || ''}
                    onChange={this.props.handleChange}
                    name="job_company"
                    placeholder="Company name"
                  />
                  <b className="tooltip tooltip-bottom-right">Required</b>{' '}
                </label>
              </section>

              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-append fa fa-lock" />
                  <input
                    type="email"
                    value={this.props.job_email || ''}
                    onChange={this.props.handleChange}
                    name="job_email"
                    placeholder="Work email"
                  />
                  <b className="tooltip tooltip-bottom-right">Required</b>{' '}
                </label>
              </section>
            </div>
          </fieldset>
          <fieldset>
            <label className="label">Contact telephone</label>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-prepend fa fa-user" />
                  <input
                    type="text"
                    name="job_telephone"
                    placeholder="Telephone"
                    value={this.props.job_telephone || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-prepend fa fa-user" />
                  <input
                    type="text"
                    name="job_telephone_alt"
                    placeholder="Alt telephone"
                    value={this.props.job_telephone_alt || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
            </div>
          </fieldset>

          <fieldset>
            <label className="label">Company address</label>
            <div className="row">
              <section className="col col-4">
                <label className="select">
                  <select name="job_country" value={this.props.job_country || '0'} onChange={this.props.handleChange}>
                    <option value="0" defaultValue disabled>
                      Pais
                    </option>
                    {this.props.countries.map((country) => {
                      return (
                        <option key={country.key + country.value} value={country.value}>
                          {country.value}
                        </option>
                      );
                    })}
                  </select>{' '}
                  <i />{' '}
                </label>
              </section>

              <section className="col col-4">
                <label className="input">
                  <input
                    type="text"
                    name="job_province"
                    placeholder="Province"
                    value={this.props.job_province || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>

              <section className="col col-4">
                <label className="input">
                  <input
                    type="text"
                    name="job_city"
                    placeholder="City"
                    value={this.props.job_city || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
            </div>
            <div className="row">
              <section className="col col-9">
                <label htmlFor="address" className="input">
                  <input
                    type="text"
                    name="job_address"
                    placeholder="Street"
                    value={this.props.job_address || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
              <section className="col col-3">
                <label className="input">
                  <input
                    type="text"
                    name="job_cp"
                    placeholder="Postal Code"
                    value={this.props.job_cp || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
            </div>
          </fieldset>

          <footer>
            <div className="text-right">
              {this.props.loading && <img className="loading-wdna" src="assets/img/loading-wdna.gif" />}
            </div>
          </footer>
        </form>
      </UiValidate>
    );
  }
}
