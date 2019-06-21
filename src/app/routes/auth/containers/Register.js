import React from "react";

import HtmlRender from "../../../components/utils/HtmlRender";
import UiValidate from "../../../components/forms/validation/UiValidate";

import { connect } from "react-redux";
import { registerUser } from "../../../components/auth/actions";
import Auth from "../../../components/auth/Auth";

const terms = require("html-loader!./TermsAndConditions.html");

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      error: false
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleFormSubmit(event) {
    this.setState({
      error: false
    });

    event.preventDefault();

    registerUser({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password_confirmation
    })
      .then(user => {})
      .catch(error => {
        this.setState({
          error: error
        });
      });
  }

  render() {
    if (this.props.authenticated) {
      this.props.history.push("/");
      return null;
    }

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
              <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                <div className="well no-padding">
                  <UiValidate>
                    <form
                      id="smart-form-register"
                      className="smart-form client-form"
                    >
                      <header>Registro</header>
                      <fieldset>
                        <section>
                          <label className="input">
                            {" "}
                            <i className="icon-append fa fa-user" />
                            <input
                              type="text"
                              value={this.state.name}
                              onChange={this.handleChange}
                              name="name"
                              placeholder="Nombre de usuario"
                            />
                            <b className="tooltip tooltip-bottom-right">
                              Necesario para entrar en la web
                            </b>{" "}
                          </label>
                        </section>

                        <section>
                          <label className="input">
                            {" "}
                            <i className="icon-append fa fa-envelope" />
                            <input
                              type="email"
                              value={this.state.email}
                              onChange={this.handleChange}
                              name="email"
                              placeholder="Email"
                            />
                            <b className="tooltip tooltip-bottom-right">
                              Necesario para verificar tu cuenta
                            </b>{" "}
                          </label>
                        </section>

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

                      <fieldset>
                        <section>
                          <label className="checkbox">
                            <input type="checkbox" name="terms" id="terms" />
                            <i />
                            Estoy de acuerdo con los{" "}
                            <a
                              href="#"
                              data-toggle="modal"
                              data-target="#myModal"
                            >
                              {" "}
                              Términos y condiciones{" "}
                            </a>
                          </label>
                        </section>
                      </fieldset>
                      <footer>
                        {this.state.error ? (
                          <span
                            className="help-block animated shake"
                            style={{ float: "left", color: "#A90329" }}
                          >
                            <i className="fa fa-warning" /> {this.state.error}
                          </span>
                        ) : null}

                        <a
                          className="btn btn-primary"
                          onClick={this.handleFormSubmit}
                        >
                          Registrar
                        </a>
                      </footer>

                      <div className="message">
                        <i className="fa fa-check" />
                        <p>Gracias por tu registro!</p>
                      </div>
                    </form>
                  </UiValidate>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <div
          className="modal fade"
          id="myModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                >
                  &times;
                </button>
                <h4 className="modal-title" id="myModalLabel">
                  Términos y condiciones de uso
                </h4>
              </div>
              <div className="modal-body custom-scroll terms-body">
                <HtmlRender html={terms} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                >
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" id="i-agree">
                  <i className="fa fa-check" /> Estoy de acuerdo
                </button>

                <button
                  type="button"
                  className="btn btn-danger pull-left"
                  id="print"
                >
                  <i className="fa fa-print" /> Imprimir
                </button>
              </div>
            </div>
            {/* /.modal-content */}
          </div>
          {/* /.modal-dialog */}
        </div>
        {/* /.modal */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.getIn(["auth", "authenticated"])
  };
};

export default connect(mapStateToProps)(Register);
