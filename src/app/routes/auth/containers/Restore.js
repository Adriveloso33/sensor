import React from "react";

import HtmlRender from "../../../components/utils/HtmlRender";
import UiValidate from "../../../components/forms/validation/UiValidate";

import { connect } from "react-redux";
import { registerUser } from "../../../components/auth/actions";
import Auth from "../../../components/auth/Auth";
import axios from "axios";

const API_URL = "http://localhost/elecbalear-backend/public/api";

/*
|--------------------------------------------------------------------------
| Restore Password
|--------------------------------------------------------------------------
|
| This component restore user password
|
*/
class Restore extends React.Component {
  /**
   * Constructor
   *
   * @return void
   */
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.location.query.user,
      password: "",
      password_confirmation: "",
      token: this.props.location.query.token,
      changed: false,
      error: false
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Form change: change value
   *
   * @return void
   */
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  /**
   * Form submit: restore pass
   *
   * @return void
   */
  handleFormSubmit(event) {
    this.setState({
      error: false
    });

    event.preventDefault();

    this.restore(this.state);
  }

  /**
   * When component receive props
   *
   * @return void
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.errorMessage) {
      this.setState({
        error: nextProps.errorMessage.text
      });
    }
  }

  /**
   * Restore user password
   *
   * @return void
   */
  restore({ token, email, password, password_confirmation }) {
    axios
      .post(`${API_URL}/password/reset`, {
        token,
        email,
        password,
        password_confirmation
      })
      .then(response => {
        this.setState({ changed: true });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  /**
   * Render HTML
   *
   * @return HTML
   */
  render() {
    return (
      <div id="extr-page">
        <header id="header" className="animated fadeInDown">
          <div>
            <span id="logo">
              {" "}
              <img src="assets/img/operators/logo.png" alt="ElecBalear" />{" "}
            </span>
          </div>

          <span id="extr-page-header-space">
            <span className="hidden-mobile hiddex-xs">
              ¿Estás ya registrado?
            </span>
            &nbsp;
            <a href="#login" className="btn btn-danger">
              Inicia sesión
            </a>{" "}
          </span>
        </header>
        <div id="main" role="main" className="animated fadeInDown">
          {/* MAIN CONTENT */}
          <div id="content" className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 hidden-xs hidden-sm">
                <h1 className="txt-color-blue login-header-big">ElecBalear</h1>
                <div className="hero">
                  <div className="pull-left login-desc-box-l">
                    <h4 className="paragraph-header">
                      ¡Todos tus datos eléctricos en la palma de tu mano!
                    </h4>
                  </div>

                  <img
                    src="assets/img/demo/iphoneview.png"
                    alt=""
                    className="pull-right display-image"
                    style={{ width: "210px" }}
                  />
                </div>

                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <h5 className="about-heading">Acceso Clientes</h5>

                    <p>
                      ¿Has elegido la tarifa que mejor se te adapta? Accede a
                      nuestra plataforma de monitorización y revisa en todo
                      momento tu consumos. El software más avanzado del mercado
                      a disposición de nuestros clientes.
                    </p>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <h5 className="about-heading">La electricidad en casa</h5>

                    <p>
                      Si adaptas la iluminación a tus necesidades y usas
                      iluminación localizada: ahorras y consigues ambientes más
                      confortables.
                    </p>
                  </div>
                </div>
              </div>

              {!this.state.changed ? (
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                  <div
                    className="well no-padding"
                    style={{ borderColor: "rgba(0,0,0,0.1)" }}
                  >
                    <UiValidate>
                      <form
                        id="smart-form-register"
                        className="smart-form client-form"
                      >
                        <header>Cambio de contraseña</header>
                        <fieldset>
                          <section>
                            <label className="input">
                              {" "}
                              <i className="icon-append fa fa-lock" />
                              <input
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                name="password"
                                placeholder="Contraseña"
                                id="password"
                              />
                              <b className="tooltip tooltip-bottom-right">
                                No olvides tu contraseña
                              </b>{" "}
                            </label>
                          </section>

                          <section>
                            <label className="input">
                              {" "}
                              <i className="icon-append fa fa-lock" />
                              <input
                                type="password"
                                value={this.state.password_confirmation}
                                onChange={this.handleChange}
                                name="password_confirmation"
                                placeholder="Confirmar contraseña"
                              />
                              <b className="tooltip tooltip-bottom-right">
                                No olvides tu contraseña
                              </b>{" "}
                            </label>
                          </section>
                        </fieldset>

                        <footer>
                          {this.state.error ? (
                            <span
                              className="help-block animated shake"
                              style={{ float: "left", color: "#A90329" }}
                            >
                              <i className="fa fa-warning" /> Error al restaurar
                              la contraseña
                            </span>
                          ) : null}
                          <a
                            className="btn btn-primary"
                            onClick={this.handleFormSubmit}
                          >
                            Cambiar Contraseña
                          </a>
                        </footer>
                      </form>
                    </UiValidate>
                  </div>
                </div>
              ) : (
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                  <div className="well no-padding">
                    <form className="smart-form client-form" action="/login">
                      <header>Cambio de contraseña</header>
                      <fieldset>
                        <section>
                          <p>Contraseña restaurada</p>
                        </section>
                      </fieldset>

                      <footer>
                        <button type="submit" className="btn btn-primary">
                          Ir a login
                        </button>
                      </footer>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errorMessage: state.getIn(["auth", "error"]),
    message: state.getIn(["auth", "message"]),
    authenticated: state.getIn(["auth", "authenticated"])
  };
};

export default connect(
  mapStateToProps,
  { registerUser }
)(Restore);
