import React from "react";
import ReactDOM from "react-dom";

import SweetAlert from "sweetalert-react";
import "sweetalert/dist/sweetalert.css";
import { connect } from "react-redux";
// import { sendemail } from '../requests/index';
// import { errorMessage } from '../../../components/notifications/index';
// import { getErrorMessage } from '../../../components/utils/ResponseHandler';
import UiDatePicker from '../../../../components/forms/inputs/UiDatepicker';

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.$modal = null;
    this.$el = document.getElementById("#modals-div");

    this.state = {
      message: "",
      subject: "",
      showLiveLabelsAlert: false,
      loading: false
    };
  }

  /* React Lifecycle methods */

  componentWillReceiveProps(nextProps) {
    /* show modal */
    const showModal = nextProps.show || {};

    if (showModal === true) {
      $(this.$modal).modal({ keyboard: false, backdrop: "static" });
    } else {
      $(this.$modal).modal("hide");
    }
  }

  // parseFilterData = () => {
  //   const { user, tabs, mainFilter } = this.props || {};
  //   // const route = routing.locationBeforeTransitions.pathname;
  //   const filter = _.cloneDeep(mainFilter);

  //   filter.user_id = user.id;
  //   filter.message = this.state.message;
  //   filter.subject = this.state.subject;
  //   filter.tab = tabs.items;

  //   return filter;
  // };

  // submit = event => {
  //   event.preventDefault();
  //   this.loadingStart();
  //   let data = this.parseFilterData();

  //   // submit
  //   sendemail(data)
  //     .then(resp => {
  //       this.loadingFinish();
  //       this.dataSaved();
  //       this.handleCancel();

  //       this.setState({
  //         showLiveLabelsAlert: true,
  //         subject: "",
  //         message: ""
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       let errorMsg = getErrorMessage(error);
  //       errorMessage("Error", errorMsg);
  //       this.loadingFinish();
  //       this.dataDontSaved();
  //     });
  // };

  /* Handlers */
  handleCancel = () => {
    const { onCancel } = this.props || {};
    if (typeof onCancel === "function") onCancel();
  };

  // handleChange = event => {
  //   const target = event.target;
  //   const value = target.value;
  //   const name = target.name;
  //   this.setState({
  //     [name]: value
  //   });
  // };

  // handleReset = () => {
  //   this.setState({
  //     subject: "",
  //     message: ""
  //   });
  // };

  // loadingStart = () => {
  //   this.setState({ loading: true, saved: false, dontsaved: false });
  // };

  // loadingFinish = () => {
  //   this.setState({ loading: false });
  // };

  // dataSaved = () => {
  //   this.setState({ saved: true });
  // };

  // dataDontSaved = error => {
  //   this.setState({ dontsaved: true });
  // };

  modalContainer() {
    const { count, loading } = this.state || {};

    return (
      <div
        className="modal fade helper-modal"
        ref={el => {
          this.$modal = el;
        }}
        role="dialog"
        aria-labelledby="settingsModalLabel"
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className="modal-dialog help-desk">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleCancel}
                data-dismiss="modal"
                aria-hidden="true"
              >
                &times;
              </button>
              <h3 id="mySettingsLabel">
                {" "}
                <i className="glyphicon glyphicon-edit" /> Edit Row {count}
              </h3>
              <p>Id: 0</p>
            </div>
            <div className="modal-body">
              {/* Interfaz */}
              <form className="form-horizontal">
                <fieldset>
                  <div className="row">
                    <article className="col-sm-12 col-md-12 col-lg-12">
                      <section className="col col-10">
                        <div className="form-group">
                          <label className="col-md-2 control-label">
                            Date
                          </label>
                          <div className="col-md-4">
                            <div className="input-group">
                              <i className="fa fa-calendar"> <UiDatePicker /> </i>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="col col-10">
                        <div className="form-group">
                          <label className="col-md-2 control-label">
                            ID
                          </label>
                          <div className="col-md-4">
                            <div className="input-group">
                              <input
                                className="form-control"
                                type="text"
                                value={this.state.subject}
                                name="subject"
                                placeholder="Id..."
                                onChange={this.handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="col col-10">
                        <div className="form-group">
                          <label className="col-md-2 control-label">
                            Message
                          </label>
                          <div className="col-md-10">
                            <textarea
                              className="form-control"
                              value={this.state.message}
                              rows="2"
                              name="message"
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </section>
                    </article>
                  </div>
                </fieldset>
              </form>
            </div>

            <div className="modal-footer">
              <div className="pull-left">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handleReset}
                >
                  Reset
                </button>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.submit}
                disabled={loading}
              >
                {loading && <i className="fa fa-cog fa-spin" />}
                {!loading ? " Accept" : " Sending..."}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleCancel}
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
          {/* /.modal-content */}
        </div>
        {/* /.modal-dialog */}
        <SweetAlert
          showCancel
          show={this.state.showLiveLabelsAlert}
          success
          title="Success! Email sent successfully"
          onConfirm={() => this.setState({ showLiveLabelsAlert: false })}
        >
          Email sent successfully
        </SweetAlert>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(this.modalContainer(), this.$el);
  }
}

const mapStateToProps = state => {
  return {
    mainFilter: state.getIn(["mainFilter"]),
    user: state.getIn(["user"]),
    tabs: state.getIn(["tabs"])
  };
};

export default connect(mapStateToProps)(Modal);
