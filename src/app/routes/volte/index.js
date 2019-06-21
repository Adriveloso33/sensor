import Cqi from './loaders/cqiLoader';
import Lcm from './loaders/lcmLoader';
import Executive from './loaders/executiveLoader';
import Engineering from './loaders/engineeringLoader';

export const redirects = [
  {
    from: '/volte',
    to: '/volte/executive',
  },
];

export const routes = [
  {
    component: Cqi,
    path: '/volte/cqi',
  },
  {
    component: Lcm,
    path: '/volte/lcm',
  },
  {
    component: Executive,
    path: '/volte/executive',
  },
  {
    component: Engineering,
    path: '/volte/engineering',
  },
];
