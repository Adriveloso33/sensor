import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import HtmlRender from '../utils/HtmlRender';
import { findDOMNode } from 'react-dom';
import SelectMulti from '../select/SelectMulti';
export class TreeViewItem extends React.Component {
  getLevel = (item) => {
    const { path } = item || {};

    let level = 0;

    if (path) level = path.split('/').length - 1;

    return level;
  };

  _handleExpand = (e) => {
    e.stopPropagation();
    let item = this.props.item;
    if (item.children && item.children.length) {
      item.expanded = !item.expanded;
      this.forceUpdate();
    }
  };

  handleSelect = (data = [], item, name) => {
    let nodes = [];

    data.forEach(function(element) {
      const node = {
        name,
        value: element,
        path: item.path
      };
      nodes.push(node);
    });

    this.props.onSelect(nodes);
  };

  handleSelectTree = (value) => {
    this.props.onSelect(value);
  };

  handleDelete = (path) => {
    this.props.onDeleteRow(path);
  };

  render() {
    const item = this.props.item;
    const { config } = this.props || {};
    const { maxLevels } = config || {};

    let children = item.children ? (
      <TreeViewFilter
        className={classnames({
          'smart-treeview-group': true,
          hidden: !item.expanded
        })}
        config={config}
        onDeleteRow={this.handleDelete}
        onSelect={this.handleSelectTree}
        items={item.children}
        role="group"
      />
    ) : null;

    return (
      <li
        className={classnames({
          parent_li: item.children && item.children.length
        })}
      >
        <span onClick={this._handleExpand} style={{ backgroundColor: item.color }}>
          <span className="delete-row">
            <i className="fa fa-times" onClick={(e) => this.handleDelete(item.path)} />
          </span>
          {item.children &&
            item.children.length > 0 && <i style={{ marginRight: '5px' }} className="fa fa-plus-circle" />}
          {item.name}
          {item.children && item.children.length > 0 && ' (' + item.children.length + ')'}
        </span>
        &nbsp;
        {item.select2 && (
          <div>
            {Object.keys(item.select2).map((key) => {
              let object = item.select2[key];
              // Check max level
              const level = this.getLevel(item);
              let disabled = false;

              // if (!disableAddLevel && key == 'group_level') disabled = true;
              if (maxLevels && maxLevels <= level && key == 'group_level') disabled = true;
              if (maxLevels && maxLevels < level && key == 'filter_level') disabled = true;

              if (!disabled) {
                return (
                  <div key={key} className="select2-treview">
                    <SelectMulti
                      key={key}
                      data={object.data}
                      maxSelectedElements="10"
                      placeholder={object.placeholder}
                      onSave={(value) => this.handleSelect(value, item, key)}
                    />
                  </div>
                );
              }
            })}
          </div>
        )}
        {children}
      </li>
    );
  }

  componentDidUpdate = () => {
    this._handleIcon();
  };

  componentDidMount = () => {
    this._handleIcon();
  };

  _handleIcon = () => {
    let item = this.props.item;

    if (item.children && item.children.length) {
      $(findDOMNode(this))
        .find('>span>i')
        .toggleClass('fa-plus-circle', !item.expanded)
        .toggleClass('fa-minus-circle', !!item.expanded);
    }
  };
}

export default class TreeViewFilter extends React.Component {
  handleSelectTree = (value) => {
    this.props.onSelect(value);
  };

  handleDelete = (path) => {
    this.props.onDeleteRow(path);
  };

  getLevel = (item) => {
    const { path } = item || {};

    let level = 0;

    if (path) level = path.split('/').length - 1;

    return level;
  };

  render() {
    const items = this.props.items;
    const { config } = this.props || {};

    return (
      <ul role={this.props.role} className={this.props.className}>
        {items &&
          items.map((item, key) => {
            return (
              <TreeViewItem
                onDeleteRow={this.handleDelete}
                onSelect={this.handleSelectTree}
                config={config}
                key={_.uniqueId('treeview-item')}
                item={item}
              />
            );
          })}
      </ul>
    );
  }
}
