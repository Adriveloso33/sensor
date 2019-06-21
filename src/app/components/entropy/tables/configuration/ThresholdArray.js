import React from 'react';

import ThresholdItem from './ThresholdItem';

export default class TableThresholdArray extends React.Component {
  getTableConfiguration = () => {
    return this.props.tableConfiguration || {};
  };

  getItemThresholdsCount = (id) => {
    const tableConfiguration = this.getTableConfiguration();

    const itemConfig = tableConfiguration[id];
    if (itemConfig) {
      return itemConfig.length;
    }

    return 1;
  };

  getItemThresholdConfig = (item, thresholdIndex) => {
    const tableConfiguration = this.getTableConfiguration();
    let itemConfig = { ...item };

    try {
      const itemThresholdConfig = tableConfiguration[item.id][thresholdIndex];
      itemConfig = Object.assign({}, itemConfig, itemThresholdConfig);
    } catch (ex) {}

    return itemConfig;
  };

  callFunc = (func, params) => {
    if (typeof func === 'function') func(params);
  };

  renderThresholdsArrayForItem = (item) => {
    const { id } = item;
    const thresholdsCount = this.getItemThresholdsCount(id);
    const thresholdsArray = [];

    for (let i = 0; i < thresholdsCount; i++) {
      const itemConfig = this.getItemThresholdConfig(item, i);

      const thresholdsItem = (
        <ThresholdItem
          elementKey={itemConfig.key}
          isHeadingItem={i == 0}
          id={id}
          index={i}
          {...itemConfig}
          onAddThreshold={this.props.onAdd}
          onRemoveThreshold={this.props.onRemove}
          onChange={this.props.handleChanges}
        />
      );

      thresholdsArray.push(thresholdsItem);
    }

    return thresholdsArray;
  };

  render() {
    const { item } = this.props || {};

    return this.renderThresholdsArrayForItem(item);
  }
}
