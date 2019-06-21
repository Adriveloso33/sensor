import Audit from './loaders/auditLoader';
import Warnings from './loaders/warningsLoader';
import DiskUsage from './loaders/diskUsageLoader';
import Logs from './loaders/logsLoader';
import Parameters from './loaders/parametersLoader';

export const redirects = [
  {
    from: '/system',
    to: '/system/audit',
  },
];

export const routes = [
  {
    component: Audit,
    path: '/system/audit',
  },
  {
    component: Warnings,
    path: '/system/warnings',
  },
  {
    component: DiskUsage,
    path: '/system/diskUsage',
  },
  {
    component: Logs,
    path: '/system/Logs',
  },
  {
    component: Parameters,
    path: '/system/parameters',
  },
];
