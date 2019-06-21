import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { connect } from 'react-redux';
import ModalHeader from './components/ModalHeader';
import ModalBody from './components/ModalBody';
import ModalFooter from './components/ModalFooter';

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.$modal = null;
    this.$el = document.getElementById('#modals-div');

    this.state = {
      message: '',
      subject: '',
      showLiveLabelsAlert: false,
    };
  }

  /* React Lifecycle methods */

  componentWillReceiveProps(nextProps) {
    /* show modal */
    const showModal = nextProps.show || {};

    if (showModal === true) {
      $(this.$modal).modal({ keyboard: false, backdrop: 'static' });
    } else {
      $(this.$modal).modal('hide');
    }
  }

  submit = (event) => {
    event.preventDefault();
  };

  /* Handlers */
  handleCancel = () => {
    const { onCancel } = this.props || {};
    if (typeof onCancel === 'function') onCancel();
  };

  handleChange = (event) => {
    const { target } = event;
    const { value } = target;
    const { name } = target;
    this.setState({
      [name]: value,
    });
  };

  modalContainer() {
    return (
      <div
        className="modal fade helper-modal"
        ref={(el) => {
          this.$modal = el;
        }}
        role="dialog"
        aria-labelledby="settingsModalLabel"
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className="modal-dialog help-desk">
          <div className="modal-content">
            <ModalHeader handleCancel={this.handleCancel} />
            <ModalBody
              subject={this.state.subject}
              message={this.state.message}
              handleChange={this.handleChange}
              form={this.props.form}
            />
            <ModalFooter handleReset={this.handleReset} submit={this.submit} handleCancel={this.handleCancel} />
          </div>
        </div>
        <SweetAlert
          showCancel
          show={this.state.showLiveLabelsAlert}
          success
          title="Row edited successfully"
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

const mapStateToProps = (state) => {
  return {
    mainFilter: state.getIn(['mainFilter']),
    user: state.getIn(['user']),
    tabs: state.getIn(['tabs']),
  };
};

export default connect(mapStateToProps)(Modal);

Modal.propTypes = {
  form: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
};
