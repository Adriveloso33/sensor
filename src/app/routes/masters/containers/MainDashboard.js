import React from 'react';
import PropTypes from 'prop-types';
import DashboardLauncher from '../../../components/dashboards/components/DashboardLauncher';

/* Components */
import ActionTypesHoc from '../components/dashboard/ActionTypesHoc';
import AlarmsActionsHoc from '../components/dashboard/AlarmsActionsHoc';
import CompaniesHoc from '../components/dashboard/CompaniesHoc';
import CustomersHoc from '../components/dashboard/CustomersHoc';
import CustomerTypesHoc from '../components/dashboard/CustomerTypesHoc';
import LogTypesHoc from '../components/dashboard/LogTypesHoc';
import ModuleTypesHoc from '../components/dashboard/ModuleTypesHoc';
import ResultTypesHoc from '../components/dashboard/ResultTypesHoc';
import UsersHoc from '../components/dashboard/UsersHoc';

import { config } from '../../../config/config';

const { apiRootUrl } = config;
const { devicesApiRootUrl } = config;

export default function load(props = {}) {
  let dashConfig = [];
  const { title } = props;

  switch (title) {
    case 'ActionTypes':
      dashConfig = [
        {
          widths: [12, 12, 12], // sm, md, lg
          component: ActionTypesHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/type/action/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/type/action/set`,
            devicesUrlGet: `${devicesApiRootUrl}/type/action/get`,
          },
        },
      ];
      break;

    case 'AlarmsActions':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: AlarmsActionsHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/action/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/action/set`,
            devicesUrlGet: `${devicesApiRootUrl}/action/get`,
          },
        },
      ];
      break;

    case 'Companies':
      dashConfig = [
        {
          widths: [12, 12, 12],
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

    case 'Customers':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: CustomersHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            /* Currently showing password data */
            devicesUrl: `${devicesApiRootUrl}/client/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/client/set`,
            devicesUrlGet: `${devicesApiRootUrl}/client/get`,
          },
        },
      ];
      break;

    case 'CustomerTypes':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: CustomerTypesHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/type/client/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/type/client/set`,
            devicesUrlGet: `${devicesApiRootUrl}/type/client/get`,
          },
        },
      ];
      break;

    case 'LogTypes':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: LogTypesHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/type/log/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/type/log/set`,
            devicesUrlGet: `${devicesApiRootUrl}/type/log/get`,
          },
        },
      ];
      break;

    case 'ModuleTypes':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: ModuleTypesHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/type/module/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/type/module/set`,
            devicesUrlGet: `${devicesApiRootUrl}/type/module/get`,
          },
        },
      ];
      break;

    case 'ResultTypes':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: ResultTypesHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            devicesUrl: `${devicesApiRootUrl}/type/result/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/type/result/set`,
            devicesUrlGet: `${devicesApiRootUrl}/type/result/get`,
          },
        },
      ];
      break;

    case 'Users':
      dashConfig = [
        {
          widths: [12, 12, 12],
          component: UsersHoc,
          props: {
            url: `${apiRootUrl}/entropy/dashboard/grid`,
            /* Currently showing password data */
            devicesUrl: `${devicesApiRootUrl}/user/list`,
            devicesUrlInsert: `${devicesApiRootUrl}/user/set`,
            devicesUrlGet: `${devicesApiRootUrl}/user/get`,
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
