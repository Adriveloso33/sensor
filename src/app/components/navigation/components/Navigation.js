import React from 'react';

import NavMenu from './NavMenu';
import MinifyMenu from './MinifyMenu';

import { connect } from 'react-redux';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <aside id="left-panel">
        <MinifyMenu />
        <nav>
          <NavMenu
            userRoles={this.props.userRoles}
            openedSign={'<i class="fa fa-minus-square-o"></i>'}
            closedSign={'<i class="fa fa-plus-square-o"></i>'}
          />
        </nav>
      </aside>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userRoles: state.getIn(['user', 'role'], []),
    route: state.getIn(['routing']),
  };
};

export default connect(mapStateToProps)(Navigation);
