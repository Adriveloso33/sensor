import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

import NavMenuList from './NavMenuList';

import { config } from '../../../config/config';

import { navigationInit } from '../NavigationActions';

import { loadCustomDashboards, insertItemsCustomDashboard } from './NavCustomDashboard';
import { hasPermission } from '../../user';

const { operator } = globals;
/* eslint-disable */
const navigationMenu = require(`../../../config/navigation/navigation.${operator}.json`);
/* eslint-enable */

class NavMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navItems: false,
    };
  }

  componentDidMount() {
    if (this.props.userRoles) {
      this.init();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      const nextRefreshId = _.get(nextProps, 'navigation.refresh');
      const thisRefreshId = _.get(this.props, 'navigation.refresh');

      if (nextRefreshId && nextRefreshId !== thisRefreshId) {
        this.init();
      }
    }
  }

  addId = (item) => {
    if (item.items) {
      item.items = item.items.map(this.addId);
    }

    if (!item._id) {
      item._id = Math.random()
        .toString(36)
        .slice(2);
    }

    return item;
  };

  filterByPermissions = (item) => {
    if (item.items) {
      item.items = item.items.filter(this.filterByPermissions);
    }

    // check among the permission list
    let userHasPermission = true;
    let permissionList = item.permissions || [];

    permissionList.forEach((permSubList) => {
      // check if the user has one of the permissions sub list {ex: "view_user|delete_users"}
      let has = false;
      let subList = permSubList.split('|');
      subList.forEach((permission) => {
        has = has || hasPermission(permission);
      });

      userHasPermission = userHasPermission && has;
    });

    return userHasPermission;
  };

  loadItems = (menu) => {
    let navItems = _.cloneDeep(menu).items.map(this.addId);

    navItems = navItems.filter(this.filterByPermissions);

    this.setState({ navItems }, this.update);

    store.dispatch(navigationInit(navItems));
  };

  init = () => {
    const menu = _.cloneDeep(navigationMenu);

    loadCustomDashboards()
      .then((items) => {
        if (items) insertItemsCustomDashboard(menu, items);

        this.loadItems(menu);
      })
      .catch(() => {
        this.loadItems(menu);
      });
  };

  update = () => {
    const defaults = {
      accordion: true,
      speed: config.menu_speed,
      closedSign: '[+]',
      openedSign: '[-]',
    };

    //@todo get rid of jquery stuff

    // Extend our default options with those provided.
    const opts = $.extend({}, defaults, this.props);
    //Assign current element to variable, in this case is UL element
    const $this = $(findDOMNode(this));

    //add a mark [+] to a multilevel menu
    $this.find('li').each(function() {
      if ($(this).find('ul').length !== 0) {
        //add the multilevel sign next to the link
        $(this)
          .find('a:first')
          .append("<b class='collapse-sign'>" + opts.closedSign + '</b>');

        //avoid jumping to the top of the page when the href is an #
        if (
          $(this)
            .find('a:first')
            .attr('href') == '#'
        ) {
          $(this)
            .find('a:first')
            .click(function() {
              return false;
            });
        }
      }
    });

    //open active level
    $this.find('a.active').each(function(li) {
      $(this)
        .parents('ul')
        .slideDown(opts.speed);
      $(this)
        .parents('ul')
        .parent('li')
        .find('b:first')
        .html(opts.openedSign);
      $(this)
        .parents('ul')
        .parent('li')
        .addClass('open');
    });

    $this.find('li a').click(function() {
      if (
        $(this)
          .parent()
          .find('ul').length !== 0
      ) {
        if (opts.accordion) {
          //Do nothing when the list is open
          if (
            !$(this)
              .parent()
              .find('ul')
              .is(':visible')
          ) {
            const parents = $(this)
              .parent()
              .parents('ul');
            const visible = $this.find('ul:visible');
            visible.each(function(visibleIndex) {
              var close = true;
              parents.each(function(parentIndex) {
                if (parents[parentIndex] == visible[visibleIndex]) {
                  close = false;
                  return false;
                }
              });
              if (close) {
                if (
                  $(this)
                    .parent()
                    .find('ul') != visible[visibleIndex]
                ) {
                  $(visible[visibleIndex]).slideUp(opts.speed, function() {
                    $(this)
                      .parent('li')
                      .find('b:first')
                      .html(opts.closedSign);
                    $(this)
                      .parent('li')
                      .removeClass('open');
                  });
                }
              }
            });
          }
        } // end if
        if (
          $(this)
            .parent()
            .find('ul:first')
            .is(':visible') &&
          !$(this)
            .parent()
            .find('ul:first')
            .hasClass('active')
        ) {
          $(this)
            .parent()
            .find('ul:first')
            .slideUp(opts.speed, function() {
              $(this)
                .parent('li')
                .removeClass('open');
              $(this)
                .parent('li')
                .find('b:first')
                .delay(opts.speed)
                .html(opts.closedSign);
            });
        } else {
          $(this)
            .parent()
            .find('ul:first')
            .slideDown(opts.speed, function() {
              /*$(this).effect("highlight", {color : '#616161'}, 500); - disabled due to CPU clocking on phones*/
              $(this)
                .parent('li')
                .addClass('open');
              $(this)
                .parent('li')
                .find('b:first')
                .delay(opts.speed)
                .html(opts.openedSign);
            });
        } // end else
      } // end if
    });
  };

  render() {
    let { navItems } = this.state;
    return navItems ? <NavMenuList items={navItems} /> : this.props.children || null;
  }
}

NavMenu.propTypes = {
  accordion: PropTypes.bool,
  speed: PropTypes.number,
  closedSign: PropTypes.string,
  openedSign: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    navigation: state.getIn(['navigation']),
  };
};

export default connect(mapStateToProps)(NavMenu);
