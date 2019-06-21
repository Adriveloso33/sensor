import PanelConfigNew from './loaders/panelconfigNewLoader';
import PanelConfigEdit from './loaders/panelconfigEditLoader';
import PanelConfigList from './loaders/panelconfigListLoader';

export const redirects = [
  {
    from: '/dashboard',
    to: '/dashboard/new',
  },
];

export const routes = [
  {
    component: PanelConfigNew,
    path: '/dashboard/new',
  },
  {
    component: PanelConfigEdit,
    path: '/dashboard/edit/:id',
  },
  {
    component: PanelConfigList,
    path: '/dashboard/list',
  },
];
