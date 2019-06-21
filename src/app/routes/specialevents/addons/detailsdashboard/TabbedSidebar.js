import React from 'react';
import PropTypes from 'prop-types';

import UiTabs from '../../../../components/ui/UiTabs';

import TableSidebar from './tablesidebar/TableSidebarHOC';
import GraphSidebar from './graphsidebar/GraphSidebarHOC';

export default class TabbedSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tabbed-sidebar">
        <UiTabs id="tabbed-sidebar">
          <ul ref="main_tabs">
            <li>
              <a href="#table_tab"> Table </a>
            </li>
            <li>
              <a href="#graph_tab"> Graph </a>
            </li>
          </ul>

          <div id="table_tab">
            <TableSidebar {...this.props} />
          </div>

          <div id="graph_tab">
            <GraphSidebar {...this.props} />
          </div>
        </UiTabs>
      </div>
    );
  }
}

TabbedSidebar.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
