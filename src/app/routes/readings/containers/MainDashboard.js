import React from 'react';
import PropTypes from 'prop-types';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import ReadingsHoc from '../components/dashboard/ReadingsHoc';

import { config } from '../../../config/config';

const { apiRootUrl } = config;
const { devicesApiRootUrl } = config;

export default function load(props = {}) {
  let dashConfig = [];
  const { title } = props;
  switch (title) {
    case 'Readings':
      dashConfig = [
        {
          widths: [12, 12, 12], // sm, md, lg
          component: ReadingsHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            /* Not enough memory to run this requests */
            devicesUrl: `${devicesApiRootUrl}/sensor/register/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/sensor/register/set`,
            devicesUrlGet: `${devicesApiRootUrl}/sensor/register/get`,
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
