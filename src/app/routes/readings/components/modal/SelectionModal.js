import React from 'react';
import ReactDOM from 'react-dom';

import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { connect } from 'react-redux';

import ModalHeader from './components/ModalHeader';

class SelectionModal extends React.Component {
  constructor(props) {
    super(props);

    this.$modal = null;
    this.$el = document.getElementById('#modals-div');

    this.state = {
      showLiveLabelsAlert: false,
    };
  }

  /* React Lifecycle methods */

  componentWillReceiveProps(nextProps) {
    /* show modal */
    const showModal = nextProps.showSelector || {};

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

  modalContainer() {
    const { count, loading } = this.state || {};
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
            <SensorTable />
          </div>
          {/* /.modal-content */}
        </div>
        {/* /.modal-dialog */}
        <SweetAlert
          showCancel
          showSelector={this.state.showLiveLabelsAlert}
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

export default connect(mapStateToProps)(SelectionModal);
