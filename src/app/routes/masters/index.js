import AlarmActions from './loaders/alarmsActionsLoader';
import Customers from './loaders/customersLoader';
import Companies from './loaders/companiesLoader';
import ActionTypes from './loaders/actionTypesLoader';
import CustomerTypes from './loaders/customerTypesLoader';
import LogTypes from './loaders/logTypesLoader';
import ModuleTypes from './loaders/moduleTypesLoader';
import ResultTypes from './loaders/resultTypesLoader';
import Users from './loaders/usersLoader';

export const redirects = [
  {
    from: '/masters',
    to: '/masters/alarmsActions',
  },
];

export const routes = [
  {
    component: AlarmActions,
    path: '/masters/alarmsActions',
  },
  {
    component: Customers,
    path: '/masters/customers',
  },
  {
    component: Companies,
    path: '/masters/companies',
  },
  {
    component: ActionTypes,
    path: '/masters/actionTypes',
  },
  {
    component: CustomerTypes,
    path: '/masters/customerTypes',
  },
  {
    component: LogTypes,
    path: '/masters/logTypes',
  },
  {
    component: ModuleTypes,
    path: '/masters/moduleTypes',
  },
  {
    component: ResultTypes,
    path: '/masters/resultTypes',
  },
  {
    component: Users,
    path: '/masters/users',
  },
];
