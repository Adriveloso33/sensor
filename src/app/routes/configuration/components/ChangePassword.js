import React from 'react';

import UiValidate from '../../../components/forms/validation/UiValidate';
import { getLoggedUserInfo, updatePassword } from '../../../components/user/UserActions';
import { errorMessage } from '../../../components/notifications';

export default class ChangePassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Login del usuario
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    getLoggedUserInfo()
      .then((user) => {
        this.setState({
          name: user.name,
          email: user.email,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.loadingStart();

    updatePassword({
      password: this.state.password,
      password_confirmation: this.state.password_confirmation,
    })
      .then((resp) => {
        this.loadingFinish();
        this.dataSaved();
        this.setState({
          password: '',
          password_confirmation: '',
        });
      })
      .catch((err) => {
        console.log(err);
        this.loadingFinish();
        errorMessage('Error', err.message);
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

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
    return (
      <UiValidate>
        <form className="smart-form" onSubmit={this.handleFormSubmit}>
          {this.state.saved && (
            <div className="alert alert-success fade in">
              <button className="close" data-dismiss="alert">
                ×
              </button>
              <i className="fa-fw fa fa-check" />
              <strong> Success!</strong> Password changed successful!
            </div>
          )}
          {this.state.dontsaved && (
            <div className="alert alert-danger fade in">
              <button className="close" data-dismiss="alert">
                ×
              </button>
              <i className="fa-fw fa fa-warning" />
              <strong> Error</strong> {this.state.dontsaved}
            </div>
          )}
          <fieldset>
            <label className="label">User account</label>
            <section>
              <label className="input">
                {' '}
                <i className="icon-append fa fa-user" />
                <input
                  type="text"
                  value={this.state.name}
                  onChange={this.handleChange}
                  name="name"
                  placeholder="User name"
                  disabled
                />
              </label>
            </section>

            <section>
              <label className="input">
                {' '}
                <i className="icon-append fa fa-envelope" />
                <input
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  name="email"
                  placeholder="Email"
                  disabled
                />
              </label>
            </section>

            <section>
              <label className="input">
                {' '}
                <i className="icon-append fa fa-lock" />
                <input
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  name="password"
                  placeholder="Password"
                  id="password"
                />
                <b className="tooltip tooltip-bottom-right">New password</b>{' '}
              </label>
            </section>

            <section>
              <label className="input">
                {' '}
                <i className="icon-append fa fa-lock" />
                <input
                  type="password"
                  value={this.state.password_confirmation}
                  onChange={this.handleChange}
                  name="password_confirmation"
                  placeholder="Password confirmation"
                />
                <b className="tooltip tooltip-bottom-right">New password confirm</b>{' '}
              </label>
            </section>
          </fieldset>

          <footer>
            <div className="text-right">
              {this.state.loading && <img className="loading-wdna" src="assets/img/loading-wdna.gif" />}

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
