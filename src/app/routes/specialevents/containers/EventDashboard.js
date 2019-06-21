import React from 'react';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainGraph from '../components/eventdashboard/MainGraph';

/* Sidebar */
import MainFilters from '../addons/eventdashboard/mainfilter/MainFilters';

const defaultGraphConfig = {
  widths: [12, 12, 12],
  component: MainGraph,
  props: {},
};

export default function load(props = {}) {
  const { graphsData, initialFilterState } = props;
  const { num_graphs, id_graphs } = graphsData;

  /* Dashboard config */
  const config = [];
  for (let i = 0; i < num_graphs; i++) {
    config.push({
      ...defaultGraphConfig,
      props: {
        id_graph: id_graphs[i],
        initialFilterState,
      },
    });
  }

  /* Sidebar config */
  const sidebar = [() => <MainFilters initialState={initialFilterState} />];

  return <DashboardLauncher config={config} sidebar={sidebar} />;
}
