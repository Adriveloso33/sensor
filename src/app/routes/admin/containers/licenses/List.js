import React from 'react';
import DashboardLauncher from '../../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainTable from '../../components/licenses/MainTable';

export default function load(props) {
  const dashConfig = [
    {
      widths: [12, 12, 12],
      component: MainTable,
      props: {
        title: 'Licenses',
      },
    },
  ];

  return <DashboardLauncher config={dashConfig} {...props} />;
}
