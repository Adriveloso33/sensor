import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import UiValidate from '../../../components/forms/validation/UiValidate';
import { getLoggedUserInfo, updateUserData, getAllAreas } from '../../../components/user/UserActions';
import countries from '../../../components/forms/commons/countries';
import Select2 from 'react-select2-wrapper';

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Login del usuario
      id: '',
      email: '',
      // Datos extras del usuario
      name: '',
      dni: '',
      birthday: '',
      day: 0,
      month: 0,
      year: 0,
      telephone: '',
      telephone_alt: '',
      country: 0,
      province: '',
      city: '',
      address: '',
      cp: '',
      loading: false,
      saved: false,
      dontsaved: false,
      areaList: false,
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
    getLoggedUserInfo()
      .then((userData) => {
        this.parseUserData(userData);
      })
      .catch((error) => {});
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

  parseUserData = (user) => {
    let { id, email, name } = user;
    let { dni, address, birthday, city, country, cp, province, telephone, telephone_alt } = user.extra || {};

    this.setState({
      id,
      name,
      email,
      dni,
      address,
      birthday,
      day: moment(birthday, 'YYYY-MM-DD').date(),
      month: moment(birthday, 'YYYY-MM-DD').month(),
      year: moment(birthday, 'YYYY-MM-DD').year(),
      city,
      country,
      cp,
      province,
      telephone,
      telephone_alt,
    });
  };

  handleFormSubmit(event) {
    event.preventDefault();
    this.loadingStart();

    this.updateUser();
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  sanitizeData = (data) => {
    for (let key in data) {
      if (data[key] === null || data[key] == '') delete data[key];
    }
  };

  updateUser = () => {
    let {
      email,
      name,
      dni,
      address,
      day,
      month,
      year,
      city,
      country,
      cp,
      province,
      telephone,
      telephone_alt,
    } = this.state;

    let birthday = moment();
    birthday.set('date', day);
    birthday.set('month', month);
    birthday.set('year', year);
    birthday = birthday.format('YYYY-MM-DD');
    birthday = moment(birthday).isValid() ? birthday : null;

    let data = {
      email,
      name,
      dni,
      address,
      birthday,
      city,
      country,
      cp,
      province,
      telephone,
      telephone_alt,
    };

    this.sanitizeData(data);

    updateUserData(data, this.props.userId)
      .then((response) => {
        this.loadingFinish();
        this.dataSaved();
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
    let { areaList } = this.state;
    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.props.submit}>
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
                <b className="tooltip tooltip-bottom-right">Necesario para verificar tu cuenta</b>{' '}
              </label>
            </section>

            <section>
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
          </fieldset>
          <fieldset>
            <label className="label">User data</label>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-prepend fa fa-user" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={this.props.name || ''}
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
                    name="dni"
                    placeholder="DNI/NIF"
                    value={this.props.dni || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
            </div>
          </fieldset>

          <fieldset>
            <label className="label">Birthday</label>
            <div className="row">
              <section className="col col-3">
                <label className="select">
                  <select name="day" value={this.props.day || '0'} onChange={this.props.handleChange}>
                    <option value="0" disabled>
                      Day
                    </option>
                    {Array.apply(1, Array(31)).map(function(x, i) {
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

              <section className="col col-3">
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
                    {Array.apply(1, Array(118)).map(function(x, i) {
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
            <label className="label">Contact</label>
            <div className="row">
              <section className="col col-6">
                <label className="input">
                  {' '}
                  <i className="icon-prepend fa fa-phone" />
                  <input
                    type="tel"
                    name="telephone"
                    placeholder="Phone"
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
                    placeholder="Alt phone"
                    value={this.props.telephone_alt || ''}
                    onChange={this.props.handleChange}
                  />
                </label>
              </section>
            </div>
          </fieldset>

          <fieldset>
            <label className="label">Address</label>
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
                    placeholder="Street"
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
