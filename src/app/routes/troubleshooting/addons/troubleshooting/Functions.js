import React from 'react';
import PropTypes from 'prop-types';

import SideAccordion from '../../../../components/sidebar/components/SideAccordion';
import KpiEvolution from '../../../../components/kpievolution/KpiEvolution';

export default class TroubleshootingFunctions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div id="sidebar-lte-functions">
        <SideAccordion
          openedSign={'<i class="fa fa-minus-square-o"></i>'}
          closedSign={'<i class="fa fa-plus-square-o"></i>'}
          items={[
            {
              title: 'KPI Evolution',
              id: 'kpi-ev-el',
              icon: 'wdna-kpi-evolution',
              content: <KpiEvolution />,
            },
          ]}
        />
      </div>
    );
  }
}

TroubleshootingFunctions.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
