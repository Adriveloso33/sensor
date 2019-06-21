import React from 'react';
import PropTypes from 'prop-types';

import Switch from 'react-switch';

const defaultRefreshTimeout = 1000;

export default class RefreshSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      autoRefresh: props.autoRefresh || false,
    };

    this.timer = null;
  }

  componentDidMount() {
    this.refreshTimerState();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  refreshTimerState = () => {
    const { autoRefresh } = this.state;
    if (autoRefresh) this.initializeTimer();
    else this.clearTimer();
  };

  initializeTimer = () => {
    this.clearTimer();

    const { timeout = defaultRefreshTimeout } = this.props;
    this.timer = setInterval(this.onRefreshHandler, timeout);
  };

  clearTimer = () => {
    clearInterval(this.timer);
  };

  handleSwitch = (autoRefresh) => {
    this.setState(
      {
        autoRefresh,
      },
      this.refreshTimerState
    );
  };

  onRefreshHandler = () => {
    const { onRefresh } = this.props;
    if (typeof onRefresh !== 'function') this.defaultOnRefresh();
    else onRefresh();
  };

  // Attempt to export the mainFilter object assuming that
  // getFilterInternalState function is present in the parentState
  defaultOnRefresh = () => {
    try {
      const { getFilterInternalState } = this.context.parentState;
      const mainFilter = getFilterInternalState();
      this.context.updateParent({
        mainFilter,
      });
    } catch (Ex) {}
  };

  render() {
    const { autoRefresh } = this.state;

    return (
      <div className="cl-element" style={{ width: '100%' }}>
        <label htmlFor="normal-switch">
          <Switch
            className="react-switch"
            onChange={this.handleSwitch}
            checked={autoRefresh}
            aria-labelledby="neat-label"
            id="auto-refresh-switch"
            height={30}
            offColor="#5c6875"
            onColor="#0f610f"
          />
          <span style={{ position: 'relative', top: '-10px', marginLeft: '10px' }}>Auto Refresh</span>
        </label>
      </div>
    );
  }
}

RefreshSwitch.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};

RefreshSwitch.propTypes = {
  timeout: PropTypes.number,
  autoRefresh: PropTypes.bool,
  onRefresh: PropTypes.func,
};
