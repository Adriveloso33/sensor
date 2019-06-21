import React from 'react';
import PropTypes from 'prop-types';

import { activeOrReloadTab } from '../TabsActions';
import { getRoutePathName, getRouteParams } from '../../../helpers/RouteHelper';

const keyTabId = 'tabId';

export default class TabLoader extends React.Component {
  componentDidMount() {
    this.setUpTab();
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props);
  }

  setUpTab = () => {
    const routeParams = getRouteParams(this.context.router);
    const { tabId } = routeParams;

    if (tabId) {
      activeOrReloadTab(tabId, this.loadTab);
    } else {
      this.loadNewTab();
    }
  };

  loadNewTab = () => {
    const route = getRoutePathName(this.context.router);
    const params = getRouteParams(this.context.router);

    params[keyTabId] = getStr();

    const paramsURL = this.joinParams(params);

    this.context.router.history.replace({
      pathname: route,
      search: `?${paramsURL}`,
    });
  };

  joinParams = (params) => {
    let paramsArrayText = [];

    Object.keys(params).forEach((key) => {
      const paramText = this.paramText(key, params[key]);

      paramsArrayText.push(paramText);
    });

    return this.joinParamsArray(paramsArrayText);
  };

  paramText = (key, value) => {
    return `${key}=${value}`;
  };

  joinParamsArray = (params) => {
    return params.join('&');
  };

  loadTab = () => {
    throw new Error('loadTab method not implemented');
  };

  render() {
    this.setUpTab();
    return null;
  }
}

TabLoader.propTypes = {};

TabLoader.defaultProps = {};

TabLoader.contextTypes = {
  router: PropTypes.object.isRequired,
};
