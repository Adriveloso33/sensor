import React from 'react';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainTable from '../components/checknetworkelements/MainTable';

export default function load(props = {}) {
  const config = [
    {
      widths: [12, 12, 12],
      component: MainTable,
      props: { ...props },
    },
  ];

  return <DashboardLauncher config={config} />;
}
