import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Msg from "../../i18n/Msg";
import { NavLink } from "react-router-dom";

import SmartMenuList from "./NavMenuList";

export default class SmartMenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      class: ""
    };
  }

  componentDidMount() {
    this.classNameActive(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.classNameActive(nextProps);
  }

  classNameActive(props) {
    const actualPath = this.context.router.history.location.pathname;
    const item = props.item;

    const className = item.route && actualPath == item.route ? "active" : "";
    if (className != this.state.class) {
      this.setState({
        class: className
      });
    }
  }

  handleClick = (item, e) => {
    if (!item) return;
    const { onClickFunc } = item;

    if (onClickFunc) {
      e.preventDefault();
      this.makeFuncCall(onClickFunc, item);
    }
  };

  makeFuncCall = (funcName, args) => {
    const func = window[funcName];
    if (typeof func === "function") func(args);
  };

  render() {
    const item = this.props.item;

    const title = !item.parent ? (
      <span className="menu-item-parent">
        <Msg phrase={item.title} />
      </span>
    ) : (
      <Msg phrase={item.title} />
    );

    const badge = item.badge ? (
      <span className={item.badge.class}>{item.badge.label || ""}</span>
    ) : null;
    const childItems = item.items ? <SmartMenuList items={item.items} /> : null;

    const icon = item.icon ? (
      item.counter ? (
        <i className={item.icon}>
          <em>{item.counter}</em>
        </i>
      ) : (
        <i className={item.icon} />
      )
    ) : null;

    const liClassName = this.state.class;
    const separationClassName = item.separation ? "nav-separation" : "";

    const link = item.route ? (
      <NavLink
        to={item.route}
        title={item.title}
        className={separationClassName}
        activeClassName="active"
      >
        {icon} {title} {badge}
      </NavLink>
    ) : (
      <a
        href={item.href || "#"}
        className={separationClassName}
        onClick={this.handleClick.bind(this, item)}
        title={item.title}
      >
        {icon} {title} {badge}
      </a>
    );

    return (
      <li className={classNames(liClassName, item.className)}>
        {link}
        {childItems}
      </li>
    );
  }
}

SmartMenuItem.contextTypes = {
  router: PropTypes.object.isRequired
};
