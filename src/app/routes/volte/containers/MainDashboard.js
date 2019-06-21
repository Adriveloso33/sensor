import React from 'react';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import MainTable from '../components/dashboard/MainTable';

import { config } from '../../../config/config';

const { apiRootUrl } = config;

export default function load(props = {}) {
  const dashConfig = [
    {
      widths: [12, 12, 12], // sm, md, lg
      component: MainTable,
      props: {
        url: `${apiRootUrl}/entropy/dashboard/grid`,
        title: `${props.title} Table`,
      },
    },
  ];

  return <DashboardLauncher config={dashConfig} />;
}
