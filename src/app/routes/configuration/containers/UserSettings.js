import React from 'react';

import { WidgetGrid, JarvisWidget } from '../../../components';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import UserInfo from '../components/UserInfo';
import JobInfo from '../components/JobInfo';
import ChangePassword from '../components/ChangePassword';
import SkinSwitcher from '../components/SkinSwitcher';
import { getLoggedUserInfo, updateUserData } from '../../../components/user/UserActions';

export default class UserSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      email: '',
      password: '',
      password_confirmation: '',
      // Datos extras del usuario
      role_id: '',
      area_id: '',
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
      department_user_id: '',
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
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    getLoggedUserInfo()
      .then((userData) => {
        this.parseUserData(userData);
      })
      .catch((error) => {});
  }

  parseUserData = (user) => {
    let { id, email, name, role_id, area_id } = user;
    let { dni, address, birthday, city, country, cp, province, telephone, telephone_alt } = user.extra || {};
    let {
      department_user_id,
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
      id,
      name,
      email,
      role_id,
      area_id,
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
      department_user_id,
      job_company,
      job_email,
      job_telephone,
      job_telephone_alt,
      job_address,
      job_cp,
      job_city,
      job_province,
      job_country,
    });
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleSelect2 = (event) => {
    const element = event.target;
    const value = element.value;
    const name = element.name;

    this.setState({
      [name]: value,
    });
  };

  submit = (event) => {
    event.preventDefault();
    this.loadingStart();

    let {
      id,
      email,
      name,
      password,
      password_confirmation,
      role_id,
      area_id,
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
      department_user_id,
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

    let birthday = moment();
    birthday.set('date', day);
    birthday.set('month', month - 1);
    birthday.set('year', year);
    birthday = birthday.format('YYYY-MM-DD');
    birthday = moment(birthday).isValid() ? birthday : null;

    let data = {
      id,
      password,
      password_confirmation,
      role_id,
      area_id,
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
      department_user_id,
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

        // setTimeout(() => {
        //   this.context.router.goBack();
        // }, 1000);
      })
      .catch((error) => {
        console.log(error);
        this.loadingFinish();
        this.dataDontSaved(error);
      });
  };

  sanitizeData = (data) => {
    for (let key in data) {
      if (data[key] === null || data[key] == '') delete data[key];
    }
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

  getId() {
    const paramString = _.get(this.context, 'router.history.location.search', '');

    const id = queryString.parse(paramString)['id'];

    return id;
  }

  render() {
    let state = this.state;
    const userId = store.getState().getIn(['user']).id;
    return (
      <div id="content" class="userOptionsPanel">
        {/* widget grid */}

        <WidgetGrid>
          {/* START ROW */}

          <div className="row">
            {/* NEW COL START */}
            <article className="col-sm-12 col-md-12 col-lg-6">
              {/* Widget ID (each widget will need unique ID)*/}
              <JarvisWidget
                editbutton={false}
                togglebutton={false}
                editbutton={false}
                fullscreenbutton={false}
                colorbutton={false}
                deletebutton={false}
              >
                <header>
                  <ul className="nav nav-tabs pull-left in secondary-tabs">
                    <li className="active">
                      <a data-toggle="tab" href="#hr1">
                        {' '}
                        <i className="fa fa-user" />{' '}
                        <span className="hidden-mobile hidden-tablet"> Personal data </span>{' '}
                      </a>
                    </li>

                    {/*<li>
                      <a data-toggle="tab" href="#hr2">
                        {" "}
                        <i className="fa fa-briefcase" />{" "}
                        <span className="hidden-mobile hidden-tablet">
                          {" "}
                          Job data{" "}
                        </span>{" "}
                      </a>
                    </li>*/}

                    <li>
                      <a data-toggle="tab" href="#hr3">
                        {" "}
                        <i className="fa fa-lock" />{" "}
                        <span className="hidden-mobile hidden-tablet">
                          {" "}
                          Password{" "}
                        </span>{" "}
                      </a>
                    </li>

                    <li>
                      <a data-toggle="tab" href="#hr4">
                        {' '}
                        <i className="fa fa-cogs" />{' '}
                        <span className="hidden-mobile hidden-tablet"> Visual options </span>{' '}
                      </a>
                    </li>
                  </ul>
                </header>

                {/* widget content */}
                <div className="widget-body" style={{ padding: 0 }}>
                  <div className="tab-content">
                    <div className="tab-pane active" id="hr1">
                      <UserInfo
                        id={userId}
                        handleChange={this.handleChange}
                        submit={this.submit}
                        handleSelect2={this.handleSelect2}
                        {...state}
                      />
                    </div>

                    <div className="tab-pane" id="hr2">
                      <JobInfo
                        id={userId}
                        handleChange={this.handleChange}
                        submit={this.submit}
                        handleSelect2={this.handleSelect2}
                        {...state}
                      />
                    </div>

                    <div className="tab-pane" id="hr3">
                      <ChangePassword />
                    </div>

                    <div className="tab-pane" id="hr4">
                      <SkinSwitcher />
                    </div>
                  </div>
                </div>
                {/* end widget content */}
              </JarvisWidget>
              {/* end widget */}
            </article>
            {/* END COL */}
          </div>

          {/* END ROW */}
        </WidgetGrid>

        {/* end widget grid */}
      </div>
    );
  }
}
