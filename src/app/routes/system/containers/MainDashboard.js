import React from 'react';
import PropTypes from 'prop-types';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

import AuditHoc from '../components/dashboard/AuditHoc';
import WarningsHoc from '../components/dashboard/WarningsHoc';
import DiskUsageHoc from '../components/dashboard/DiskUsageHoc';
import LogsHoc from '../components/dashboard/LogsHoc';
import ParametersHoc from '../components/dashboard/ParametersHoc';

import { config } from '../../../config/config';

const { apiRootUrl } = config;
const { devicesApiRootUrl } = config;

export default function load(props = {}) {
  let dashConfig = [];
  const { title } = props;

  switch (title) {
    case 'Audit':
      dashConfig = [
        {
          widths: [12, 12, 12], // sm, md, lg
          component: AuditHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/audit/list`,
          },
        },
      ];
      break;

    case 'Warnings':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: WarningsHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/notice/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/notice/set`,
            devicesUrlGet: `${devicesApiRootUrl}/notice/get`,
          },
        },
      ];
      break;

    case 'DiskUsage':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: DiskUsageHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
          },
        },
      ];
      break;

    case 'Logs':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: LogsHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            /* Not enough memory to run this requests */
            // devicesUrl: `${devicesApiRootUrl}/log/list`,
            // devicesUrlInsert: `${devicesApiRootUrl}/log/set`,
            // devicesUrlGet: `${devicesApiRootUrl}/log/get`,
          },
        },
      ];
      break;

    case 'Parameters':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: ParametersHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/param/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/param/set`,
            devicesUrlGet: `${devicesApiRootUrl}/param/get`,
          },
        },
      ];
      break;

    default:
      break;
  }

  return <DashboardLauncher config={dashConfig} />;
}

load.propTypes = {
  title: PropTypes.string.isRequired,
};
