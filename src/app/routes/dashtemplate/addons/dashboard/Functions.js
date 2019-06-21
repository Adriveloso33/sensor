import React from 'react';
import PropTypes from 'prop-types';

import SideAccordion from '../../../../components/sidebar/components/SideAccordion';

export default class Functions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    /**
     * Place require conditions here the SideAccordion only shows once
     * therefore returns null until all conditions were satisfied
     */

    return (
      <div id="sidebar-lte-functions">
        <SideAccordion
          openedSign={'<i class="fa fa-minus-square-o"></i>'}
          closedSign={'<i class="fa fa-plus-square-o"></i>'}
          items={[
            {
              title: 'Function 1',
              id: 'wo-el',
              icon: 'wdna-worst-offenders',
              content: null
            },
            {
              title: 'Function 2',
              id: 'kpi-drilldown-el',
              icon: 'wdna-drilldown-market',
              content: null
            }
          ]}
        />
      </div>
    );
  }
}

Functions.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired
};
