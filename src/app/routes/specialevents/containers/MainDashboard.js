import React from 'react';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainTable from '../components/maindashboard/MainTable';
import NewElement from '../addons/NewElement';

const config = [
  {
    widths: [12, 12, 12],
    component: MainTable,
    props: {
      title: 'Main Table',
    },
  },
];

const MF = (props) => <NewElement />;

export default function load() {
  return <DashboardLauncher config={config} />;
}
