import Companies from './loaders/companiesLoader';
import Sensors from './loaders/sensorsLoader';
import PendingCustomers from './loaders/pendingCustomersLoader';
import Customers from './loaders/customersLoader';
import Alarms from './loaders/alarmsLoader';
import Warnings from './loaders/warningsLoader';

export const redirects = [
  {
    from: '/technician',
    to: '/technician/companies',
  },
];

export const routes = [
  {
    component: Companies,
    path: '/technician/companies',
  },
  {
    component: Sensors,
    path: '/technician/sensors',
  },
  {
    component: PendingCustomers,
    path: '/technician/pendingCustomers',
  },
  {
    component: Customers,
    path: '/technician/customers',
  },
  {
    component: Alarms,
    path: '/technician/alarms',
  },
  {
    component: Warnings,
    path: '/technician/warnings',
  },
];
