import { getStr } from 'wdna-highchart/lib/libs/HC';
import queryString from 'query-string';

const untitledTabTitle = 'Untitled';

export const ADD_TAB = 'ADD_TAB',
  REMOVE_TAB = 'REMOVE_TAB',
  REMOVE_ALL = 'REMOVE_ALL',
  PIN_TAB = 'PIN_TAB',
  UNPIN_TAB = 'UNPIN_TAB',
  ACTIVE_TAB = 'ACTIVE_TAB',
  DESACTIVE_TAB = 'DESACTIVE_TAB',
  RESET_TABS = 'RESET_TABS';

export function addTab(data) {
  if (!data.hasOwnProperty('route')) data.route = getCurrentRoute();
  if (!data.hasOwnProperty('params')) data.params = getCurrentRouteParams();
  if (!data.hasOwnProperty('id')) data.id = getStr();
  if (!data.hasOwnProperty('title')) data.title = untitledTabTitle;

  return {
    type: ADD_TAB,
    data: data,
  };
}

function getCurrentRoute() {
  let currentRoute = '';

  try {
    currentRoute = store.getState().getIn(['router', 'location', 'pathname']);
  } catch (ex) {}

  return currentRoute;
}

function getCurrentRouteParams() {
  let currentRouteParams = {};

  try {
    const stringParams = store.getState().getIn(['router', 'location', 'search']);
    currentRouteParams = queryString.parse(stringParams);
  } catch (ex) {}

  return currentRouteParams;
}

export function removeTab(id) {
  return {
    type: REMOVE_TAB,
    id: id,
  };
}

export function removeAll() {
  return {
    type: REMOVE_ALL,
  };
}

export function resetTabs() {
  return {
    type: RESET_TABS,
  };
}

export function pinTab(id) {
  return {
    type: PIN_TAB,
    id: id,
  };
}

export function unPinTab(id) {
  return {
    type: UNPIN_TAB,
    id: id,
  };
}

export function activeTab(id) {
  return {
    type: ACTIVE_TAB,
    id: id,
  };
}

export function desactiveTab(id) {
  return {
    type: DESACTIVE_TAB,
    id: id,
  };
}

export function isTabRemoved(tabId) {
  const tabs = store.getState().getIn(['tabs'], {});
  const { items } = tabs || {};

  return items.find((tabInfo) => tabInfo.id === tabId) == null;
}

export function activeOrReloadTab(tabId, reloadCallback) {
  setTimeout(() => {
    if (isTabRemoved(tabId)) {
      if (typeof reloadCallback === 'function') reloadCallback(tabId);
    } else {
      store.dispatch(activeTab(tabId));
    }
  }, 0);
}
