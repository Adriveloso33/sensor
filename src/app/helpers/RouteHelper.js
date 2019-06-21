import queryString from 'query-string';

export function getRoutePathName(router) {
  try {
    return router.route.location.pathname;
  } catch (Ex) {
    return null;
  }
}

export function getRouteParams(router) {
  try {
    const { search } = router.route.location;
    return queryString.parse(search);
  } catch (Ex) {
    return {};
  }
}

export function idTab(router) {
  const routePrams = getRouteParams(router);

  const id = routePrams.tabId;

  return id;
}

export function checkThisTabId(router, id) {
  const idThisTab = idTab(router);

  return idThisTab === id;
}
