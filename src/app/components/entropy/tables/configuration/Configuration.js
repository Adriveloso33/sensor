import React from 'react';
import PropTypes from 'prop-types';

import ThresholdArray from './ThresholdArray';

import WdnaColors from '../../../../helpers/HighChartColors';
import RotationList from '../../../list/RotationList';

export default class TableConfiguration extends React.Component {
  static propTypes = {
    elements: PropTypes.array.isRequired,
    configuration: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {};

    this.colorsList = new RotationList(WdnaColors, null, null);
  }

  componentDidMount() {
    const { configuration } = this.props;
    this.initialize(configuration);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      const { configuration } = nextProps;
      this.initialize(configuration);
    }
  }

  initialize = (initialConfig) => {
    this.setState(
      {
        ...initialConfig,
      },
      this.initializeElements
    );
  };

  initializeElements = () => {
    const { elements } = this.props;

    elements.forEach((element) => {
      const { id } = element;
      if (!this.state[id]) this.initializeThresholds(id);
    });
  };

  initializeThresholds = (itemId, cb) => {
    const defaultItemConfig = this.getEmptyItemConfig(itemId);

    this.setState(
      {
        [itemId]: defaultItemConfig,
      },
      () => {
        if (typeof cb === 'function') cb();
      }
    );
  };

  getEmptyItemConfig = () => [
    {
      key: getStr(),
      color: this.getItemColor(),
    },
  ];

  assignKeys = (items) => {
    const clonedItems = _.cloneDeep(items);

    return clonedItems.map((item) => ({
      ...item,
      key: getStr(),
    }));
  };

  goToNextColor = () => {
    this.colorsList.goNext();
  };

  getItemColor = () => {
    const color = this.colorsList.currentItem();
    this.goToNextColor();

    return color;
  };

  handleChanges = (id, index, key, value) => {
    const itemConfig = _.cloneDeep(this.state[id]);

    if (!itemConfig) {
      const cb = this.handleChanges.bind(this, id, index, key, value);
      this.initializeThresholds(id, cb);
      return;
    }

    // makes changes
    itemConfig[index][key] = value;
    this.setState(
      {
        [id]: itemConfig,
      },
      this.notifyChanges
    );
  };

  onAddThreshold = (id) => {
    const thresholdConfig = this.state[id];
    if (!thresholdConfig) {
      this.initializeThresholds(id, this.onAddThreshold.bind(this, id));
      return;
    }

    // add the new threshold
    const newConfig = _.cloneDeep(thresholdConfig);
    newConfig.push(this.getEmptyItemConfig(null)[0]);
    this.setState(
      {
        [id]: newConfig,
      },
      this.notifyChanges
    );
  };

  onRemoveThreshold = (id, index) => {
    const thresholdConfig = this.state[id];
    const newConfig = _.cloneDeep(thresholdConfig);
    newConfig.splice(index, 1);

    this.setState(
      {
        [id]: newConfig,
      },
      this.notifyChanges
    );
  };

  notifyChanges = () => {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      const configuration = _.cloneDeep(this.state);

      onChange(configuration);
    }
  };

  render() {
    const { elements } = this.props;

    return (
      <fieldset>
        <h3>Table thresholds:</h3>
        <div className="row">
          <section className="col col-sm-8 col-lg-6">
            <table className="table table-striped">
              <thead>
                <tr style={{ textAlign: 'center' }}>
                  <td style={{ width: '100px' }}>Name</td>
                  <td style={{ width: '50px' }}>Min</td>
                  <td style={{ width: '50px' }}>Max</td>
                  <td style={{ width: '50px' }}>Color</td>
                  <td style={{ width: '50px' }}>Add/Remove</td>
                </tr>
              </thead>
              <tbody>
                {elements.map((item, index) => (
                  <ThresholdArray
                    item={item}
                    key={index}
                    tableConfiguration={this.state}
                    onAdd={this.onAddThreshold}
                    onRemove={this.onRemoveThreshold}
                    handleChanges={this.handleChanges}
                  />
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </fieldset>
    );
  }
}
