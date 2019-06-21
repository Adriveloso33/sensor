import React from 'react';
import PropTypes from 'prop-types';

import SideAccordion from '../../../../../components/sidebar/components/SideAccordion';

import CheckNetworkElements from '../../../containers/CheckNetworkElements';
import KpiToCounters from './KpiToCounters';
import MasterList from './MasterList';

import { createTab } from '../../../../../helpers/TabsHelper';
import { cleanFilter } from '../../../../../helpers/FilterHelper';

export default class Functions extends React.Component {
  constructor(props) {
    super(props);
  }

  loadCheckNetworkElements = () => {
    const tabInfo = {
      title: 'Check Network Elements',
      active: true,
      component: CheckNetworkElements,
      props: {
        mainFilter: this.getFilterCNE(),
      },
    };

    createTab(tabInfo, false);
  };

  getFilterCNE = () => {
    const mainFilter = this.getMainFilter();
    const paramsForCNE = [
      'arrFilterDate',
      'vendor',
      'vendor_id',
      'region_id',
      'id_event',
      'event_ne_type',
      'arrFilterNe',
      'drilldown',
    ];

    return cleanFilter(mainFilter, paramsForCNE);
  };

  getMainFilter = () => {
    return this.context.parentState.getFilterInternalState();
  };

  render() {
    return (
      <div id="special-events-functions">
        <SideAccordion
          openedSign={'<i class="fa fa-minus-square-o"></i>'}
          closedSign={'<i class="fa fa-plus-square-o"></i>'}
          items={[
            {
              title: 'KPI to Counters',
              id: 'kpi-to-counters',
              icon: 'wdna-kpi-counters',
              content: <KpiToCounters />,
            },
            {
              title: 'Check Network Elements',
              id: 'check-network-elements',
              icon: 'wdna-tx',
              content: null,
              onClick: this.loadCheckNetworkElements,
            },
            {
              title: 'MasterList',
              id: 'masterlist',
              icon: 'wdna-masterlist',
              content: <MasterList />,
            },
          ]}
        />
      </div>
    );
  }
}

Functions.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
