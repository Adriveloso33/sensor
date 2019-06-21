import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import UiTabs from '../../ui/UiTabs';
import { activeTab, removeTab, pinTab, unPinTab, desactiveTab } from '../TabsActions';

import classnames from 'classnames';

const stylePointer = {
  cursor: 'pointer',
};

const pinPinnedClass = 'txt-color-red';
const pinNormalClass = 'txt-color-white';
const closeIconClass = 'fa fa-times txt-color-white';
const keyTabId = 'tabId';

class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.counter = 0;
    this.activeTabId = false;
    this.forceNoUpdate = false;
  }

  componentDidMount() {
    this.updateTabs();
  }

  componentDidUpdate() {
    this.updateTabs();

    // active a specific tab
    const { activeTabId } = this;

    if (activeTabId) {
      this.forceNoUpdate = true;
      store.dispatch(desactiveTab(activeTabId));

      this.activateCustomTab(activeTabId);

      this.activeTabId = false;
    }
  }

  shouldComponentUpdate() {
    if (this.forceNoUpdate) {
      this.forceNoUpdate = false;
      return false;
    }

    return true;
  }

  updateTabs = () => {
    let tabs = $('#tabs');

    tabs.find('.ui-tabs-nav').sortable({
      axis: 'x',
      containment: 'parent',
      stop: function() {
        tabs.tabs('refresh');
      },
    });

    tabs.tabs('refresh');
  };

  activateLastTab = () => {
    let lastTabIndex = $('#tabs > ul > li').length - 1;
    $('#tabs').tabs({
      active: lastTabIndex,
    });
  };

  activateFirstTab = () => {
    $('#tabs').tabs({
      active: 0,
    });
  };

  activateCustomTab = (tabId) => {
    let tabs = $('#main-tabs > #tabs > div');
    let tabIndex = -1;

    tabs.each(function(index) {
      let id = $(this).attr('id');
      if (id == tabId) {
        tabIndex = index;
      }
    });

    $('#tabs').tabs({
      active: tabIndex,
    });
  };

  removeTab = (id, e) => {
    e.stopPropagation();

    const nextTabIndex = this.getNextTabIndexWhenRemoves(id);

    if (nextTabIndex !== -1) {
      const nextTabInfo = this.getTabInfo(nextTabIndex);
      const nextTabId = nextTabInfo.id;

      store.dispatch(activeTab(nextTabId));

      this.redirectToTabRoute(nextTabInfo);
      store.dispatch(removeTab(id));

      this.refreshScreen();
    } else {
      this.redirectToEmptyPage();
      store.dispatch(removeTab(id));
      this.refreshScreen();
    }
  };

  getNextTabIndexWhenRemoves = (currentTabId) => {
    const tabsList = this.getTabsList();
    const tabsCount = tabsList.length;

    if (tabsCount === 1) return -1; // there is only one tab, nothings to do

    const currentTabPosition = this.getTabPosition(currentTabId);

    if (currentTabPosition === tabsCount - 1) return tabsCount - 2; // is the last tab, return last - 1

    return currentTabPosition + 1;
  };

  getTabPosition(tabId) {
    const tabsList = this.getTabsList();
    const tabsCount = tabsList.length;

    for (let i = 0; i < tabsCount; i++) {
      const tabInfo = tabsList[i];
      if (tabInfo.id === tabId) return i;
    }

    return -1;
  }

  getTabsList = () => {
    const tabs = store.getState().getIn(['tabs']);
    const { items = [] } = tabs || {};

    return items;
  };

  getTabInfo = (tabIndex) => {
    const tabsList = this.getTabsList();
    return tabsList[tabIndex];
  };

  tooglePin = (e, tabId) => {
    const target = e.target;
    const element = $(target).closest('span');
    e.preventDefault();

    setTimeout(() => {
      const pinState = $(element).attr('class') || '';

      if (pinState.includes(pinNormalClass)) {
        // is not pinned PIN IT!!!!
        $(element).toggleClass(pinPinnedClass);
        store.dispatch(pinTab(tabId));
      } else {
        // is pinned UNPIN IT!!!
        $(element).toggleClass(pinNormalClass);
        store.dispatch(unPinTab(tabId));
      }
    }, 0);
  };

  refreshScreen = () => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  };

  handleTabClick = (tab, e) => {
    this.redirectToTabRoute(tab);
    this.refreshScreen();
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

  redirectToTabRoute = (tabInfo) => {
    let { params = {} } = tabInfo;
    const { route, id } = tabInfo;

    params[keyTabId] = id;

    const paramsURL = this.joinParams(params);

    if (route) {
      this.context.router.history.replace({
        pathname: route,
        search: `?${paramsURL}`,
      });
    }
  };

  redirectToEmptyPage = () => {
    this.context.router.history.replace({
      pathname: '/main',
      search: '',
    });
  };

  calculateTabMinWidth = () => {
    const ulWidth = $(this.refs.main_tabs).width();

    const { items = [] } = this.props;

    const tabsCount = items.length || 1;

    const offset = 60; // 50px offset
    const itemSize = ulWidth / tabsCount - offset;

    return itemSize > 0 ? itemSize : 0;
  };

  render() {
    const items = this.props.items || [];
    const tabsWidth = this.calculateTabMinWidth();

    return (
      <div id="main-tabs">
        <UiTabs id="tabs">
          <ul ref="main_tabs">
            {items.map((tab) => {
              let { id } = tab;
              if (tab.active == true) this.activeTabId = id;
              if (tab.title === 'Empty page') {
                return <div> </div>;
              }
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={this.handleTabClick.bind(this, tab)}
                    style={stylePointer}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={tab.title}
                  >
                    <span
                      style={stylePointer}
                      className={classnames(tab.pin ? pinPinnedClass : pinNormalClass, 'tab-pin')}
                      onClick={(e) => this.tooglePin(e, id)}
                    >
                      <i className="fa fa-thumb-tack" aria-hidden="true" onClick={() => {}} />
                    </span>
                    <span className="tab-text" style={{ maxWidth: tabsWidth }}>
                      {' '}
                      {tab.title}{' '}
                    </span>
                    <span style={stylePointer} onClick={(e) => this.removeTab(id, e)}>
                      <i className={closeIconClass} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          {items.map((tab, index) => {
            let Component = tab.component;
            let props = tab.props;
            let tabId = tab.id;
            return (
              <div id={`${tab.id}`} key={tab.id}>
                <Component {...props} tabId={tabId} />
              </div>
            );
          })}
        </UiTabs>
      </div>
    );
  }
}

Tabs.contextTypes = {
  router: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    items: state.getIn(['tabs', 'items']),
  };
};

export default connect(mapStateToProps)(Tabs);
