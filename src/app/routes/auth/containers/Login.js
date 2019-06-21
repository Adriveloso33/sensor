import React from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../../components/auth/actions';
import { errorMessage } from '../../../components/notifications';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      rememberme: true,
      error: false,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    const type = target.type;

    if (type == 'checkbox') value = target.checked;

    this.setState({
      [name]: value,
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();
    this.setState({
      error: false,
      loading: true,
    });

    loginUser(
      {
        email: this.state.email,
        password: this.state.password,
      },
      this.state.rememberme
    ).catch((error) => {
      console.log('ERROR!!');
      errorMessage('Error', error);
      this.finishLoading();
    });
  }

  finishLoading = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    let authenticated = this.props.authenticated;
    let roles = this.props.roles;

    let { loading } = this.state;

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
                    <section>
                      <label className="input">
                        <input
                          type="password"
                          name="password"
                          value={this.state.password}
                          placeholder="Password"
                          onChange={this.handleChange}
                        />
                      </label>
                    </section>
                    <section className="check-login">
                      <label className="toggle remember">
                        <input type="checkbox" name="rememberme" onChange={this.handleChange} defaultChecked={true} />
                        <i data-swchon-text="ON" data-swchoff-text="OFF" /> <span>Remember me</span>
                      </label>

                      <div className="note">{/*<a href="/#/forgot">I forgot my password</a>*/}</div>
                    </section>
                  </fieldset>
                  <footer>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading && <i className="fa fa-refresh fa-spin login-loader" />} Log in
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
    authenticated: state.getIn(['auth', 'authenticated'], null),
    roles: state.getIn(['user', 'role'], null),
  };
};

export default connect(mapStateToProps)(Login);
