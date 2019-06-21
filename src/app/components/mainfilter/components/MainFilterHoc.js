import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class MainFilterHoc extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={classnames('main-filters', this.props.classNames)}> {this.props.children}</div>;
  }
}

MainFilterHoc.contextTypes = {
  parentState: PropTypes.object,
  updateParent: PropTypes.func
};
