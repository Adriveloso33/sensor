import Sensors from './loaders/sensorsLoader';
import Settings from './loaders/settingsLoader';
import Alarms from './loaders/alarmsLoader';
import Configurations from './loaders/configurationsLoader';
import Firmwares from './loaders/firmwaresLoader';
import Graph from './loaders/graphLoader';
import Redirections from './loaders/redirectionsLoader';
import Types from './loaders/typesLoader';
import Variables from './loaders/variablesLoader';

export const redirects = [
  {
    from: '/sensors',
    to: '/sensors/sensors',
  },
];

export const routes = [
  {
    component: Sensors,
    path: '/sensors/sensors',
  },
  {
    component: Settings,
    path: '/sensors/settings',
  },
  {
    component: Alarms,
    path: '/sensors/Alarms',
  },
  {
    component: Configurations,
    path: '/sensors/configurations',
  },
  {
    component: Firmwares,
    path: '/sensors/firmwares',
  },
  {
    component: Graph,
    path: '/sensors/graph',
  },
  {
    component: Redirections,
    path: '/sensors/redirections',
  },
  {
    component: Types,
    path: '/sensors/types',
  },
  {
    component: Variables,
    path: '/sensors/variables',
  },
];
