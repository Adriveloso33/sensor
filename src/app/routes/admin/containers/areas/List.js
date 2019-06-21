import React from 'react';
import DashboardLauncher from '../../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainTable from '../../components/areas/MainTable';

/* Sidebar */
import Functions from '../../addons/areas/Functions';

export default function load(props) {
  const dashConfig = [
    {
      widths: [12, 12, 12],
      component: MainTable,
      props: {
        title: 'Areas',
      },
    },
  ];

  const sidebarConfig = [Functions];

  return <DashboardLauncher config={dashConfig} sidebar={sidebarConfig} {...props} />;
}
