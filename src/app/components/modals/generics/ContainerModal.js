import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import classnames from 'classnames';

const MODAL_DOM_NODE = '#modals-div';
const FADE_TIMEOUT = 100;

export default class ContainerModal extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    modalClass: PropTypes.string,
    show: PropTypes.bool,
    headerButtons: PropTypes.array,
    footerButtons: PropTypes.array,
    children: PropTypes.node,
    onClose: PropTypes.func,
    fullScreenButton: PropTypes.bool,
    exportRef: PropTypes.func,
  };

  static defaultProps = {
    title: 'Modal',
    modalClass: '',
    children: null,
    show: false,
    headerButtons: [],
    footerButtons: [],
    onClose: null,
    fullScreenButton: false,
    exportRef: null,
  };

  constructor(props) {
    super(props);

    this.modalRef = React.createRef();
    this.$el = document.getElementById(MODAL_DOM_NODE);

    this.state = {
      isOnFullScreen: false,
    };

    this.turnScreenMode = this.turnScreenMode.bind(this);
    this.closeOnFullScreen = this.closeOnFullScreen.bind(this);
  }

  // ==============================
  //    React Lifecycle methods
  // ==============================
  componentDidMount() {
    const { exportRef } = this.props;
    if (typeof exportRef === 'function') exportRef(this.modalRef);
  }

  componentWillReceiveProps(nextProps) {
    const { show } = nextProps;

    const isVisible = this.props.show === true;

    // handle show modal
    if (show && !isVisible) {
      this.showModal();
    } else if (!show && isVisible) {
      this.hideModal();
    }
  }

  // ==============================
  //     MODAL METHODS
  // ==============================
  showModal = () => {
    $(this.modalRef.current).modal({ keyboard: false, backdrop: 'static' });
  };

  hideModal = () => {
    $(this.modalRef.current).modal('hide');

    if (this.props.fullScreenButton && this.state.isOnFullScreen) {
      this.closeOnFullScreen();
    }
  };

  // ==============================
  //     HANDLERS
  // ==============================
  handleModalClose = (e) => {
    e.preventDefault();
    const { onClose } = this.props;
    if (typeof onClose === 'function') onClose();
  };

  // ==============================
  //     FULL SCREEN METHODS
  // ==============================
  toggleFullScreen = () => {
    if (this.state.isOnFullScreen) {
      this.turnScreenMode('NORMAL');
    } else {
      this.turnScreenMode('FULL_SCREEN');
    }
  };

  notifyWindow = () => {
    window.dispatchEvent(new Event('resize'));
  };

  fadeTo = (opacity) => {
    return new Promise((resolve) => {
      $(this.modalRef.current).fadeTo(FADE_TIMEOUT, opacity, () => {
        resolve();
      });
    });
  };

  modifyScreenState = (state, cb) => {
    this.setState(
      {
        isOnFullScreen: state,
      },
      cb
    );
  };

  async turnScreenMode(mode = 'NORMAL') {
    await this.fadeTo(0);

    if (mode === 'NORMAL') {
      $(this.modalRef.current).removeClass('fullscreen-modal');
    } else {
      $(this.modalRef.current).addClass('fullscreen-modal');
    }

    this.modifyScreenState(mode === 'FULL_SCREEN', () => {
      this.notifyWindow();
      this.fadeTo(1);
    });
  }

  async closeOnFullScreen() {
    setTimeout(() => {
      $(this.modalRef.current).removeClass('fullscreen-modal');

      this.modifyScreenState(false);
    }, 500);
  }

  // ==============================
  //     MODAL BODY
  // ==============================
  modalContainer() {
    const { isOnFullScreen } = this.state;
    const { title, modalClass, fullScreenButton } = this.props;
    const { headerButtons, footerButtons } = this.props;

    return (
      <div className="modal fade" ref={this.modalRef} role="dialog" aria-hidden="true" data-backdrop="static">
        <div className={classnames('modal-dialog', modalClass)}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-controls">
                {headerButtons.map((button) => (
                  <button
                    type="button"
                    className={classnames('control-btn', button.className)}
                    onClick={button.onClick}
                    aria-hidden="true"
                  >
                    {button.text}
                  </button>
                ))}
                {fullScreenButton && (
                  <button type="button" className="control-btn" onClick={this.toggleFullScreen} aria-hidden="true">
                    <i className={isOnFullScreen ? 'fa fa-compress' : 'fa fa-expand'} />
                  </button>
                )}
                <button type="button" className="control-btn" onClick={this.handleModalClose} aria-hidden="true">
                  <i className="fa fa-times" />
                </button>
              </div>
              <h4 className="modal-title">{title}</h4>
            </div>
            <div className="modal-body">{this.props.children}</div>
            <div className="modal-footer">
              {footerButtons.map((button) => (
                <button type="button" className={button.className} onClick={button.onClick}>
                  {button.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(this.modalContainer(), this.$el);
  }
}
