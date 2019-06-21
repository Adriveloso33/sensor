import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { connect } from 'react-redux';

import WdnaAnimation from '../animations/Wdna';

const FADE_OUT_TIMEOUT = 300;
const CANCEL_TIMEOUT = 60000; // one minute

class GlobalLoader extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    overlay: PropTypes.bool,
    cancelButton: PropTypes.bool,
    cancelTimeout: PropTypes.number,
    cancelCallback: PropTypes.func,
    skin: PropTypes.object,
  };

  static defaultProps = {
    overlay: false,
    cancelButton: false,
    cancelTimeout: CANCEL_TIMEOUT,
    cancelCallback: null,
    skin: {},
  };

  getAnimationColor = () => {
    let color = null;
    try {
      color = this.props.skin.style.loadingIntroColor;
    } catch (Ex) {
      color = null;
    }

    return color;
  };

  render() {
    const { props } = this;
    if (!props.show) return null;

    const color = this.getAnimationColor();

    return (
      <div className={classNames(props.overlay ? 'loader-overlay' : '')}>
        <div className="wdna-loader">
          <WdnaAnimation color={color} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    skin: state.getIn(['layout', 'skin']),
  };
};

export default connect(mapStateToProps)(GlobalLoader);
