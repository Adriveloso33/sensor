import React from 'react';
import Select2 from 'react-select2-wrapper';

import UiValidate from '../../../../components/forms/validation/UiValidate';
import { getAllRoles, getAllAreas } from '../../../../components/user/UserActions';
import countries from '../../../../components/forms/commons/countries';

export default class UserForm extends React.Component {
  static defaultProps = {
    countries,
  };

  constructor(props) {
    super(props);

    this.state = {
      roleList: false,
      areaList: false,
    };
  }

  componentDidMount() {
    getAllRoles()
      .then((roleList) => {
        this.setState({
          roleList,
        });
      })
      .catch((err) => {
        // fire loading errors
        console.log(err);
      });

    getAllAreas()
      .then((areaList) => {
        this.setState({
          areaList,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { roleList, areaList } = this.state;

    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.props.submit}>
          {this.props.saved && (
            <div className="alert alert-success fade in">
              <button className="close" data-dismiss="alert" type="button">
                ×
              </button>
              <i className="fa-fw fa fa-check" />
              <strong> Success!</strong> Data saved successful.
            </div>
          )}
          {this.props.dontsaved && (
            <div className="alert alert-danger fade in">
              <button className="close" data-dismiss="alert" type="button">
                ×
              </button>
              <i className="fa-fw fa fa-warning" />
              <strong> Error</strong> {this.props.dontsaved}
            </div>
          )}
          <fieldset>
            <label className="label">User account</label>

            <section>
              <label className="input">
                {' '}
                <i className="icon-append fa fa-envelope" />
                <input
                  type="email"
                  value={this.props.email || ''}
                  onChange={this.props.handleChange}
                  name="email"
                  placeholder="Email"
                />
                <b className="tooltip tooltip-bottom-right">Required</b>{' '}
              </label>
            </section>

            <section>
              <label className="input">
                {' '}
                <i className="icon-append fa fa-lock" />
                <input
                  type="password"
                  value={this.props.password || ''}
                  onChange={this.props.handleChange}
                  name="password"
                  placeholder="Password"
                  id="password"
                />
                <b className="tooltip tooltip-bottom-right">Do not forget your password</b>{' '}
              </label>
            </section>

            <section>
              <label className="input">
                {' '}
                <i className="icon-append fa fa-lock" />
                <input
                  type="password"
                  value={this.props.password_confirmation || ''}
                  onChange={this.props.handleChange}
                  name="password_confirmation"
                  placeholder="Confirm password"
                />
                <b className="tooltip tooltip-bottom-right">Do not forget your password</b>{' '}
              </label>
            </section>
            <div className="row">
              <section className="col col-6">
                <label className="label">User Role</label>
                {roleList && (
                  <Select2
                    name="role_id"
                    data={roleList.map((role) => {
                      return { text: role.name, id: role.id };
                    })}
                    value={this.props.role_id}
                    options={{
                      placeholder: 'Select user role',
                    }}
                    onSelect={this.props.handleSelect2}
                    onUnselect={this.props.handleSelect2}
                    style={{ width: '100%' }}
                  />
                )}
              </section>
              <section className="col col-6">
                <label className="label">User Area</label>
                {areaList && (
                  <Select2
                    name="area_id"
                    data={areaList.map((area) => {
                      return { text: area.name, id: area.id };
                    })}
                    value={this.props.area_id}
                    options={{
                      placeholder: 'Select user area',
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
            <label className="label">Personal data</label>
            <div className="row">
              <section className="col col-8">
                <label className="input">
                  {' '}
                  <i className="icon-prepend fa fa-user" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name and Surname"
                    value={this.props.name || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
            </div>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-prepend fa fa-user" />
                  <input
                    type="text"
                    name="dni"
                    placeholder="ID"
                    value={this.props.dni || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
            </div>
          </fieldset>

          <fieldset>
            <label className="label">Birth date</label>
            <div className="row">
              <section className="col col-3">
                <label className="select">
                  <select name="day" value={this.props.day || '0'} onChange={this.props.handleChange}>
                    <option value="0" disabled>
                      Day
                    </option>
                    {Array.apply(1, Array(31)).map((_x, i) => {
                      return (
                        <option key={i + 1} value={`${i + 1}`}>
                          {i + 1}
                        </option>
                      );
                    })}
                  </select>{' '}
                  <i />
                </label>
              </section>

              <section className="col col-6">
                <label className="select">
                  <select name="month" value={this.props.month || '0'} onChange={this.props.handleChange}>
                    <option value="0" disabled>
                      Month
                    </option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>{' '}
                  <i />{' '}
                </label>
              </section>
              <section className="col col-3">
                <label className="select">
                  <select name="year" value={this.props.year || '0'} onChange={this.props.handleChange}>
                    <option value="0" disabled>
                      Year
                    </option>
                    {Array.apply(1, Array(118)).map((x, i) => {
                      return (
                        <option key={i + 1900} value={i + 1900}>
                          {i + 1900}
                        </option>
                      );
                    })}
                  </select>{' '}
                  <i />
                </label>
              </section>
            </div>
          </fieldset>

          <fieldset>
            <label className="label">Contact info</label>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-prepend fa fa-phone" />
                  <input
                    type="tel"
                    name="telephone"
                    placeholder="Phone number"
                    value={this.props.telephone || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-prepend fa fa-phone" />
                  <input
                    type="tel"
                    name="telephone_alt"
                    placeholder="Alternative phone number"
                    value={this.props.telephone_alt || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
            </div>
          </fieldset>

          <fieldset>
            <label className="label">Address info</label>
            <div className="row">
              <section className="col col-4">
                <label className="select">
                  <select name="country" value={this.props.country || '0'} onChange={this.props.handleChange}>
                    <option value="0" defaultValue disabled>
                      Country
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
                    name="province"
                    placeholder="Province"
                    value={this.props.province || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>

              <section className="col col-4">
                <label className="input">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={this.props.city || ''}
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
                    name="address"
                    id="address"
                    placeholder="Address"
                    value={this.props.address || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
              <section className="col col-3">
                <label className="input">
                  <input
                    type="text"
                    name="cp"
                    placeholder="Postal Code"
                    value={this.props.cp || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
            </div>
          </fieldset>

          <footer>
            <div className="text-right">
              {this.props.loading && <img className="loading-wdna" src="assets/img/loading-wdna.gif" />}

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
