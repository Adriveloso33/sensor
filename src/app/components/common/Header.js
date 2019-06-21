import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import ToggleMenu from './ToggleMenu';
import Calendar from '../calendar/components/Calendar';
import Helper from '../../routes/helper/component/Helper';
import Settings from './Settings';

const defaultLogo = 'assets/img/operators/logo.png';

class Header extends React.Component {
  logout = (e) => {
    e.preventDefault();
    this.context.router.history.push('/logout');
  };

  render() {
    return (
      <header id="header">
        <div id="logo-group">
          <span id="logo">
            <img
              src={this.props.skinConfig.logo || defaultLogo} // place your logo here
              alt="Entropy"
            />
          </span>
        </div>

        {/* <RecentProjects /> */}
        <div className="pull-right header-actions" /*pulled right: nav area*/>
          {/* logout button */}
          <div id="logout" className="btn-header transparent pull-right">
            <span>
              <a
                onClick={this.logout}
                title="Sign Out"
                data-logout-msg="You can improve your security further after logging out by closing this opened browser"
              >
                <i className="wdna-logout-entropy" />
              </a>
            </span>
          </div>

          <ToggleMenu className="btn-header transparent pull-right" />

          <Calendar />

          <Helper />

          <Settings className="btn-header transparent pull-right" />
        </div>
        {/* end pulled right: nav area */}
      </header>
    );
  }
}

Header.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    skinConfig: state.getIn(['layout', 'skin']),
  };
};

export default connect(mapStateToProps)(Header);
