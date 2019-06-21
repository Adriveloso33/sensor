import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Sidebar from '../../sidebar/components/Sidebar';

/**
 * Render a fully connected dashboard using props, states and the contex api
 *
 * @param {Array} Components
 * @param {Array} SideBarElements
 */
export default function dashboardHoc(Components, SideBarElements, hiddenSideBar = false) {
  class DashboardHoc extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    updateParent = (data, cb) => {
      this.setState(
        {
          ...data,
        },
        () => {
          if (typeof cb === 'function') cb();
        },
      );
    };

    getChildContext = () => {
      const { router } = this.context || {};

      return {
        updateParent: this.updateParent,
        parentState: this.state,
        router,
      };
    };

    render() {
      const cmpList = Components || [];
      const sideList = SideBarElements || [];

      const { state, updateParent } = this;
      const hasSideBar = sideList.length > 0;
      const leftClass = hasSideBar ? 'tab-left-content' : '';

      return (
        <div className={classnames('dashboard-hoc', { 'has-sidebar': hasSideBar })}>
          <div id="tab-main-content" className={leftClass}>
            {cmpList.map((Cmp, index) => (
              <Cmp key={index} parentState={state} updateParent={updateParent} />
            ))}
          </div>

          {hasSideBar && (
            <Sidebar
              showInitSidebar={!hiddenSideBar}
              items={sideList}
              parentState={state}
              updateParent={updateParent}
            />
          )}
        </div>
      );
    }
  }

  DashboardHoc.childContextTypes = {
    updateParent: PropTypes.func,
    parentState: PropTypes.object,
    router: PropTypes.object,
  };

  DashboardHoc.contextTypes = {
    router: PropTypes.object.isRequired,
  };

  const connectedDashboard = props => <DashboardHoc />;

  return connectedDashboard;
}
