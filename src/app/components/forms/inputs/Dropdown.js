import React from 'react';
import classnames from 'classnames';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = (event, item) => {
    event.preventDefault();

    const { onChange } = this.props;

    if (typeof onChange === 'function') onChange(item);
  };

  getActiveItemTitle = (itemId) => {
    const { items = [] } = this.props;
    if (!Array.isArray(items)) return null;

    const element = items.find((item) => item.id === itemId);

    if (!element) return null;

    return element.text;
  };

  render() {
    const { items, icon, active, className, title, placeHolder, disabled } = this.props;
    const activeItemTitle = this.getActiveItemTitle(active);

    return (
      <div className={classnames('dropdown', className)}>
        <button
          className={classnames('btn btn-primary dropdown-toggle', disabled ? 'disabled' : '')}
          type="button"
          data-toggle="dropdown"
        >
          <i className={icon} />
          <span>{activeItemTitle || placeHolder}</span>
        </button>
        <ul className="dropdown-menu">
          <li className="dropdown-header">{title}</li>
          {items &&
            items.map((item, index) => {
              const { id, text } = item;
              return (
                <li key={index} className={classnames(active === id ? 'active' : '')}>
                  <a onClick={(e) => this.handleClick(e, item)}>{text}</a>
                </li>
              );
            })}
        </ul>
        {this.props.children}
      </div>
    );
  }
}
