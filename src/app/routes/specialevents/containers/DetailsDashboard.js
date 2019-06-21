import React from 'react';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainGraph from '../components/detailsdashboard/MainGraph';
import MainTable from '../components/detailsdashboard/MainTable';

/* Sidebar */
import TabbedSidebar from '../addons/detailsdashboard/TabbedSidebar';

const config = [
  {
    widths: [12, 12, 12],
    component: MainTable,
    props: {
      title: '',
      sourceType: 'table',
    },
  },
  {
    widths: [12, 12, 12],
    component: MainGraph,
    props: {
      title: '',
      sourceType: 'graph',
    },
  },
];

export default function load(props = {}) {
  const { initialFilterState } = props;

  const sidebar = [() => <TabbedSidebar initialState={initialFilterState} />];

  return <DashboardLauncher config={config} sidebar={sidebar} />;
}
