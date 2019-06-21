import React from 'react';
import PropTypes from 'prop-types';

export default class AggregationSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null
    };
  }

  componentDidMount() {
    const { value } = this.props;

    this.setState({
      value
    });
  }

  executeCallBack = (cb) => {
    const { value } = this.state || {};
    const { id } = this.props || {};

    if (typeof cb === 'function') cb(id, value);
  };

  executeHandler = (cb) => {
    const { onSelect } = this.props;

    this.executeCallBack(onSelect);
  };

  handleSelect = (event) => {
    event.preventDefault();
    const { target } = event;
    const { value } = target;

    this.setState(
      {
        value
      },
      this.executeHandler
    );
  };

  getSelectValue = (valueFromProps) => {
    const { items } = this.props || {};

    const valueExist = items.indexOf(valueFromProps);

    if (valueExist != -1) return valueFromProps;

    return 'CUSTOM';
  };

  render() {
    const { items } = this.props || {};
    const { value } = this.state || {};

    const selectedValue = value ? this.getSelectValue(value) : null;

    return (
      <select value={selectedValue} onChange={this.handleSelect}>
        {items.map((elem) => (
          <option key={elem} value={elem}>
            {elem}
          </option>
        ))}
      </select>
    );
  }
}

AggregationSelect.propTypes = {
  items: PropTypes.array,
  value: PropTypes.any,
  onSelect: PropTypes.func
};

AggregationSelect.defaultProps = {
  items: ['SUM', 'MAX', 'MIN', 'AVG'],
  value: 'SUM',
  onSelect: () => {}
};
