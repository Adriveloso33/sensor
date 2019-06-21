import UserList from './loaders/usersListLoader';
import RoleList from './loaders/rolesListLoader';
import AreaList from './loaders/areasListLoader';
import PermisssionList from './loaders/permissionsListLoader';
import DepartmentsList from './loaders/departmentsListLoader';
import GroupsList from './loaders/groupsListLoader';
import AppsList from './loaders/appsListLoader';
import LicensesList from './loaders/licensesListLoader';

export const redirects = [
  {
    from: '/admin/users',
    to: '/admin/users/list',
  },
  {
    from: '/admin/roles',
    to: '/admin/roles/list',
  },
  {
    from: '/admin/areas',
    to: '/admin/areas/list',
  },
  {
    from: '/admin/permissions',
    to: '/admin/permissions/list',
  },
  {
    from: '/admin/departments',
    to: '/admin/departments/list',
  },
  {
    from: '/admin/groups',
    to: '/admin/groups/list',
  },
  {
    from: '/admin/apps',
    to: '/admin/apps/list',
  },
  {
    from: '/admin/licenses',
    to: '/admin/licenses/list',
  },
];

export const routes = [
  {
    component: UserList,
    path: '/admin/users/list',
  },
  {
    component: RoleList,
    path: '/admin/roles/list',
  },
  {
    component: AreaList,
    path: '/admin/areas/list',
  },
  {
    component: PermisssionList,
    path: '/admin/permissions/list',
  },
  {
    component: DepartmentsList,
    path: '/admin/departments/list',
  },
  {
    component: GroupsList,
    path: '/admin/groups/list',
  },
  {
    component: AppsList,
    path: '/admin/apps/list',
  },
  {
    component: LicensesList,
    path: '/admin/licenses/list',
  },
];
