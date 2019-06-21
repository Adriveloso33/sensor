import React from 'react';
import classNames from 'classnames';

const fadeOut = 300;
const defaultTimeout = 60000; // one minute

export default class Loader extends React.Component {
  constructor(props) {
    super(props);

    this.tout = null;

    this.state = {
      show: false,
      showCancelButton: false,
    };
  }

  componentDidMount() {
    if (this.props.show === true) {
      this.setState({
        show: true,
      });
      this.setUpCancelCounter();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { show } = nextProps;

    if (!show && this.state.show) {
      // hide the loader when is visible

      setTimeout(() => {
        $(this.refs.loader).fadeOut();
      }, 0);

      setTimeout(() => {
        this.setState({
          show: false,
        });
      }, fadeOut);
    } else if (show && !this.state.show) {
      this.setState({
        show: true,
      });
      this.setUpCancelCounter();
    }
  }

  setUpCancelCounter = () => {
    this.setState(
      {
        showCancelButton: false,
      },
      () => {
        this.startCancelCounter();
      }
    );
  };

  startCancelCounter = () => {
    const { cancelTimeout } = this.props || {};
    const timeOut = cancelTimeout || defaultTimeout;

    if (this.tout) clearTimeout(this.tout);

    this.tout = setTimeout(() => {
      this.setState({
        showCancelButton: true,
      });
    }, timeOut);
  };

  cancelCb = (e) => {
    e.preventDefault();
    const { props } = this;
    const { onCancel } = props || {};

    if (typeof onCancel === 'function') onCancel();
  };

  render() {
    const { show, showCancelButton } = this.state || {};
    const { props } = this;
    const { cancelBtn } = props || {};
    const showCancel = cancelBtn && showCancelButton;

    return show ? (
      <div className={classNames(props.overlay ? 'loader-overlay' : '', props.background ? 'loader-background' : '')}>
        <div ref="loader" className={classNames('wdna-loader', props.className || '')}>
          <i className={classNames(props.icon || 'fa fa-refresh', 'fa-spin')} />
          {showCancel && (
            <a className="loader-cancel-btn" onClick={this.cancelCb}>
              <i className="wdna-cancel" />
            </a>
          )}
        </div>
      </div>
    ) : null;
  }
}
