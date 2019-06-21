import React from 'react';
import DashboardLauncher from '../../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainTable from '../../components/roles/MainTable';

/* Sidebar */
import Functions from '../../addons/roles/Functions';

export default function load(props) {
  const dashConfig = [
    {
      widths: [12, 12, 12],
      component: MainTable,
      props: {
        title: 'Roles',
      },
    },
  ];

  const sidebarConfig = [Functions];

  return <DashboardLauncher config={dashConfig} sidebar={sidebarConfig} {...props} />;
}
