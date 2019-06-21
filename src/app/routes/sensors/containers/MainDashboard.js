import React from 'react';
import PropTypes from 'prop-types';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import AlarmsHoc from '../components/dashboard/AlarmsHoc';
import ConfigurationsHoc from '../components/dashboard/ConfigurationsHoc';
import FirmwaresHoc from '../components/dashboard/FirmwaresHoc';
import GraphHoc from '../components/dashboard/GraphHoc';
import RedirectionsHoc from '../components/dashboard/RedirectionsHoc';
import SensorsHoc from '../components/dashboard/SensorsHoc';
import SettingsHoc from '../components/dashboard/SettingsHoc';
import TypesHoc from '../components/dashboard/TypesHoc';
import VariablesHoc from '../components/dashboard/VariablesHoc';

import { config } from '../../../config/config';

const { apiRootUrl } = config;
const { devicesApiRootUrl } = config;

export default function load(props = {}) {
  let dashConfig = [];
  const { title } = props;
  switch (title) {
    case 'Alarms':
      dashConfig = [
        {
          widths: [12, 12, 12], // sm, md, lg
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

    case 'Configurations':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: ConfigurationsHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/config/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/config/set`,
            devicesUrlGet: `${devicesApiRootUrl}/config/get`,
          },
        },
      ];
      break;

    case 'Firmwares':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: FirmwaresHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/firmware/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/firmware/set`,
            devicesUrlGet: `${devicesApiRootUrl}/firmware/get`,
          },
        },
      ];
      break;

    case 'Graph':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: GraphHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrlInsert: '',
            devicesUrlGet: '',
          },
        },
      ];
      break;

    case 'Redirections':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: RedirectionsHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/redirection/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/redirection/set`,
            devicesUrlGet: `${devicesApiRootUrl}/redirection/get`,
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

    case 'Settings':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: SettingsHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/adjustment/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/adjustment/set`,
            devicesUrlGet: `${devicesApiRootUrl}/adjustment/get`,
          },
        },
      ];
      break;

    case 'Types':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: TypesHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/type/sensor/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/type/sensor/set`,
            devicesUrlGet: `${devicesApiRootUrl}/type/sensor/get`,
          },
        },
      ];
      break;

    case 'Variables':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: VariablesHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/variable/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/variable/set`,
            devicesUrlGet: `${devicesApiRootUrl}/variable/get`,
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
