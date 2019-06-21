import React from 'react';

import { connect } from 'react-redux';

import UiValidate from '../../../components/forms/validation/UiValidate';

import { loginUser } from '../../../components/auth/actions';
import Auth from '../../../components/auth/Auth';

class Forgot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.setState({
      error: false,
    });
  }

  render() {
    let authenticated = this.props.authenticated;
    let roles = this.props.roles;

    if (authenticated && roles) {
      this.props.history.push('/');
      return null;
    } else {
      return (
        <div id="extr-page">
          <div id="main" role="main" className="animated fadeInDown">
            <div id="content" className="container login-layer">
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-3 login-box">
                <form id="login-form" className="smart-form" onSubmit={this.handleFormSubmit}>
                  <header>
                    <div id="login-logo">
                      <img src="assets/img/logos/logo_entropy_negativo.png" />
                    </div>
                  </header>
                  <fieldset>
                    <section>
                      <label className="input">
                        <input
                          type="email"
                          name="email"
                          value={this.state.email}
                          placeholder="Email"
                          onChange={this.handleChange}
                        />
                      </label>
                    </section>
                    <section className="check-login">
                      <div className="note">
                        <a href="/#/login">I remembered my password</a>
                      </div>
                    </section>
                  </fieldset>
                  <footer>
                    {this.state.error ? (
                      <span className="help-block animated shake" style={{ float: 'left', color: '#A90329' }}>
                        <i className="fa fa-warning" /> {this.state.error}
                      </span>
                    ) : null}
                    <button type="submit" className="btn btn-primary">
                      Restore
                    </button>
                  </footer>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.getIn(['auth', 'authenticated']),
    roles: state.getIn(['auth', 'role']),
  };
};

export default connect(mapStateToProps)(Forgot);
