import { getCustomDashboardsShortcuts } from './requests';
import { errorMessage } from '../../notifications/index';
import { getErrorMessage } from '../../utils/ResponseHandler';

export function loadCustomDashboards() {
  return getCustomDashboardsShortcuts()
    .then((resp) => {
      return allItems(resp);
    })
    .catch((error) => {
      let errorMsg = getErrorMessage(error);
      errorMessage('Error', errorMsg);
    });
}

export function insertItemsCustomDashboard(menuNavigation, newItems) {
  if (newItems) {
    const customId = 'custom-dashboards';
    const dashboardList = menuNavigation.items[0].items;
    menuNavigation.items[0].items = dashboardList.map((menuItem) => {
      const { id } = menuItem || {};
      if (id === customId) return newItems;
      return { id, ...menuItem };
    });
  }
}

function allItems(data) {
  let items = [];

  data.forEach((element) => {
    const { name = 'Unnamed' } = element;
    const { configuration, id } = element;

    items.push(item(name, { configuration, id }));
  });

  let resultItems = itemRoot();
  resultItems.items = [itemAllDashboards(), ...items];

  return resultItems;
}

function item(title, parameters) {
  const { configuration, id } = parameters;

  const item = {
    title: title,
    route: `/analytics/dashboard/${id}`,
    parameters: {
      configuration,
    },
  };

  return item;
}

function itemAllDashboards() {
  const item = {
    title: 'All Dashboards',
    route: '/dashboard/list',
    separation: true,
  };

  return item;
}

function itemRoot() {
  const item = {
    title: 'Custom Dashboards',
    icon: 'wdna-dashboard',
    permissions: ['view_custom_reports'],
    items: [],
  };

  return item;
}
