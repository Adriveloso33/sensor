import React from 'react';
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
      showLiveLabelsAlert: false,
      loading: false,
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

  submit = (event) => {
    event.preventDefault();
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
            <ModalHeader handleCancel={this.props.handleCancel} />
            <ModalBody handleChange={this.handleChange} />
            <ModalFooter submit={this.submit} handleCancel={this.props.handleCancel} />
          </div>
        </div>
        <SweetAlert
          showCancel
          show={this.state.showLiveLabelsAlert}
          success
          title="Row edited successfully"
          onConfirm={() => this.setState({ showLiveLabelsAlert: false })}
        >
          Row edited successfully
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
