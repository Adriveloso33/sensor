import React from 'react';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainTable from '../components/dashboard/MainTable';
import MainGraph from '../components/dashboard/MainGraph';
import MainMap from '../components/dashboard/MainMap';

/* Sidebar components */
import Functions from '../addons/dashboard/Functions';
import Addons from '../addons/dashboard/Addons';
import MainFilters from '../addons/mainfilter/MainFilters';

const config = [
  {
    widths: [12, 12, 12],
    component: MainGraph,
    props: {
      title: 'Main Graph',
    },
  },
  {
    widths: [12, 6, 6],
    component: MainMap,
    props: {
      title: 'Main Map',
    },
  },
  {
    widths: [12, 6, 6],
    component: MainTable,
    props: {
      title: 'Main Table',
    },
  },
];

const sidebar = [MainFilters, Functions, Addons];

export default function load() {
  return <DashboardLauncher config={config} sidebar={sidebar} />;
}
