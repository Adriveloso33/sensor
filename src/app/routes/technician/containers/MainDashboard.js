import React from 'react';
import PropTypes from 'prop-types';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import CompaniesHoc from '../components/dashboard/CompaniesHoc';
import SensorsHoc from '../components/dashboard/SensorsHoc';
import PendingCustomersHoc from '../components/dashboard/PendingCustomersHoc';
import CustomersHoc from '../components/dashboard/CustomersHoc';
import AlarmsHoc from '../components/dashboard/AlarmsHoc';
import WarningsHoc from '../components/dashboard/WarningsHoc';

import { config } from '../../../config/config';

const { apiRootUrl } = config;
const { devicesApiRootUrl } = config;

export default function load(props = {}) {
  let dashConfig = [];
  const { title } = props;

  switch (title) {
    case 'Companies':
      dashConfig = [
        {
          widths: [12, 12, 12], // sm, md, lg
          component: CompaniesHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/company/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/company/set`,
            devicesUrlGet: `${devicesApiRootUrl}/company/get`,
          },
        },
      ];
      break;

    case 'Sensors':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: SensorsHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/sensor/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/sensor/set`,
            devicesUrlGet: `${devicesApiRootUrl}/sensor/get`,
          },
        },
      ];
      break;

    case 'PendingCustomers':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: PendingCustomersHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
          },
        },
      ];
      break;

    case 'Customers':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: CustomersHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/client/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/client/set`,
            devicesUrlGet: `${devicesApiRootUrl}/client/get`,
          },
        },
      ];
      break;

    case 'Alarms':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: AlarmsHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/alarm/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/alarm/set`,
            devicesUrlGet: `${devicesApiRootUrl}/alarm/get`,
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

    default:
      break;
  }

  return <DashboardLauncher config={dashConfig} />;
}

load.propTypes = {
  title: PropTypes.string.isRequired,
};
