import React from 'react';
import _ from 'lodash';

import PropTypes from 'prop-types';

import axios from 'axios';
import HtmlRender from '../../../../components/utils/HtmlRender';
import UiValidate from '../../../../components/forms/validation/UiValidate';

import { getAllDepartments } from '../../../../components/user/UserActions';

import { config } from '../../../../config/config';
import Auth from '../../../../components/auth/Auth';
import countries from '../../../../components/forms/commons/countries';
import Select2 from 'react-select2-wrapper';

export default class JobInfoById extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    countries
  };

  componentDidMount() {
    getAllDepartments()
      .then((departmentList) => {
        this.setState({
          departmentList
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    let { departmentList } = this.state;
    return (
      <UiValidate>
        <form id="user-form" className="smart-form">
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
                      placeholder: 'Select user department'
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
        </form>
      </UiValidate>
    );
  }
}
