import EntTableList from './loaders/enttableListLoader';

export const redirects = [
  {
    from: '/enttable',
    to: '/enttable/main',
  },
];

export const routes = [
  {
    component: EntTableList,
    path: '/enttable/main',
  },
];
