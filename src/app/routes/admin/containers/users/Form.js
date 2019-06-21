import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../../../../components/dashboards/components/Loader';
import { WidgetGrid, JarvisWidget } from '../../../../components';
import UserForm from '../../components/users/UserForm';
import NewJobInfo from '../../components/users/NewJobInfo';
import { createUser, getUserData, updateUserData } from '../../../../components/user/UserActions';
import { warningMessage, errorMessage } from '../../../../components/notifications';

export default class Form extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  componentDidMount() {
    const { userId } = this.props;
    if (userId) {
      this.loadingStart();
      getUserData(userId)
        .then((userData) => {
          this.parseUserData(userData);
          this.loadingFinish();
        })
        .catch(() => {
          this.loadingFinish();
        });
    }
  }

  parseUserData = (user) => {
    const { email, name, role_id, area_id } = user;
    const { birthday } = user.extra || {};

    this.setState({
      name,
      email,
      role_id,
      area_id,
      day: moment(birthday, 'YYYY-MM-DD').date(),
      month: moment(birthday, 'YYYY-MM-DD').month() + 1,
      year: moment(birthday, 'YYYY-MM-DD').year(),
      ...user.extra,
      ...user.job,
    });
  };

  handleChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  handleSelect2 = (event) => {
    const element = event.target;
    const { name, value } = element;
    this.setState({
      [name]: value,
    });
  };

  submit = (event) => {
    event.preventDefault();
    if (this.badData()) return;

    this.loadingStart();
    const birthday = this.getBirthday();
    const data = {
      ...this.state,
      birthday,
    };
    this.sanitizeData(data);

    const query = this.props.userId ? updateUserData : createUser;
    query(data, this.props.userId)
      .then(() => {
        this.loadingFinish();
        this.dataSaved();
        setTimeout(() => {
          this.context.router.history.replace({
            pathname: '/admin/users/',
          });
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        this.loadingFinish();
        errorMessage('Error', err.data ? err.data.message : err);
      });
  };

  badData = () => {
    const { email, password, password_confirmation, role_id, area_id, name } = this.state;
    if (!email) {
      warningMessage('Warning', 'Please introduce your email.');
      return true;
    }
    if (!this.props.userId && !password) {
      warningMessage('Warning', 'Please choose a password.');
      return true;
    }
    if (password && password.length < 8) {
      warningMessage('Warning', 'Password has to be at least 8 characters.');
      return true;
    }
    if ((password || password_confirmation) && password != password_confirmation) {
      warningMessage('Warning', 'Passwords must coincide.');
      return true;
    }
    if (!role_id) {
      warningMessage('Warning', 'Please indicate your user role.');
      return true;
    }
    if (!area_id) {
      warningMessage('Warning', 'Please indicate your user area.');
      return true;
    }
    if (!name) {
      warningMessage('Warning', 'Please introduce your name.');
      return true;
    }
    return false;
  };

  sanitizeData = (data) => {
    for (let key in data) {
      if (data[key] === null || data[key] == '') delete data[key];
    }
  };

  getBirthday = () => {
    const { day, month, year } = this.state;
    let birthday = moment();
    birthday.set('date', day);
    birthday.set('month', month - 1);
    birthday.set('year', year);
    birthday = birthday.format('YYYY-MM-DD');
    return moment(birthday).isValid() ? birthday : null;
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

  render() {
    const { state } = this;
    return (
      <div id="content">
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12 col-md-12 col-lg-12">
              <JarvisWidget
                editbutton={false}
                togglebutton={false}
                fullscreenbutton={false}
                colorbutton={false}
                deletebutton={false}
              >
                <header>
                  <ul className="nav nav-tabs pull-left in">
                    <li className="active">
                      <a data-toggle="tab" href="#hr1">
                        {' '}
                        <i className="fa fa-user" /> <span className="hidden-mobile hidden-tablet"> User data </span>{' '}
                      </a>
                    </li>

                    {
                      // hidden job data tab:
                      /* <li>
                      <a data-toggle="tab" href="#hr2">
                        {' '}
                        <i className="fa fa-user" /> <span className="hidden-mobile hidden-tablet"> Job data </span>{' '}
                      </a>
                    </li> */
                    }
                  </ul>
                </header>
                <div className="widget-body" style={{ padding: 0 }}>
                  <Loader show={this.state.loading} />
                  <div className="tab-content">
                    <div className="tab-pane active" id="hr1">
                      <UserForm
                        handleChange={this.handleChange}
                        submit={this.submit}
                        handleSelect2={this.handleSelect2}
                        {...state}
                      />
                    </div>

                    <div className="tab-pane" id="hr2">
                      <NewJobInfo
                        handleChange={this.handleChange}
                        submit={this.submit}
                        handleSelect2={this.handleSelect2}
                        {...state}
                      />
                    </div>
                  </div>
                </div>
              </JarvisWidget>
            </article>
          </div>
        </WidgetGrid>
      </div>
    );
  }
}
