import React from 'react';

import SketchColor from '../../../forms/inputs/Colorselect';

export default class TableThresholdItem extends React.Component {
  constructor(props) {
    super(props);
  }

  renderAddRemoveButton = () => {
    const { isHeadingItem = false } = this.props;

    const buttonClass = isHeadingItem ? 'btn-success' : 'btn-danger';
    const buttonText = isHeadingItem ? 'Add' : 'Remove';
    const iconClass = isHeadingItem ? 'fa fa-plus' : 'fa fa-times';

    const handlerFunc = isHeadingItem
      ? this.handleAddRemoveButton.bind(this, true)
      : this.handleAddRemoveButton.bind(this, false);

    return (
      <button className={`btn ${buttonClass}`} onClick={handlerFunc}>
        <i className={iconClass} /> {buttonText}
      </button>
    );
  };

  handleAddRemoveButton = (add, e) => {
    e.preventDefault();

    const { id, index } = this.props;
    if (add) {
      this.props.onAddThreshold(id);
    } else {
      this.props.onRemoveThreshold(id, index);
    }
  };

  handleInputs = (e) => {
    e.preventDefault();
    const { target } = e;
    const { name, value } = target;

    const { id, index } = this.props;

    this.props.onChange(id, index, name, value);
  };

  handleColors = (name, color) => {
    const { id, index } = this.props;

    this.props.onChange(id, index, name, color);
  };

  render() {
    const { props } = this;
    const { elementKey, name, min, max, color } = props || {};

    return (
      <tr key={elementKey} style={{ textAlign: 'center' }}>
        <td>{name}</td>
        <td>
          <input
            name={`min`}
            type="number"
            value={min}
            className="form-control padding-sides"
            onChange={this.handleInputs}
          />
        </td>
        <td>
          <input
            name={`max`}
            type="number"
            value={max}
            className="form-control padding-sides"
            onChange={this.handleInputs}
          />
        </td>
        <td>
          <SketchColor color={color} name="color" handleChange={this.handleColors} />
        </td>
        <td>{this.renderAddRemoveButton()}</td>
      </tr>
    );
  }
}
