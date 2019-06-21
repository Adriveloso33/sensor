import React from 'react';

export default class ToogleItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };
  }

  componentDidMount() {
    const { selected } = this.props || {};
    this.setState({
      selected
    });
  }

  executeCallBack = (cb) => {
    const { value } = this.props || {};

    if (typeof cb === 'function') cb(value);
  };

  executeHandler = (cb) => {
    const { onAdd, onRemove } = this.props || {};
    const { selected } = this.state || {};

    if (selected) this.executeCallBack(onAdd);
    else this.executeCallBack(onRemove);

    if (typeof cb === 'function') cb();
  };

  handleClick = (event) => {
    event.preventDefault();

    this.setState(
      {
        selected: !this.state.selected
      },
      this.executeHandler
    );
  };

  canShowToogleBtn = () => {
    const { colDef, targetColumnName } = this.props || {};
    const { field } = colDef || {};

    return targetColumnName === field;
  };

  render() {
    const { value } = this.props || {};
    const { selected } = this.state || {};
    const btnClass = selected ? 'bg-color-red' : 'bg-color-green',
      btnText = selected ? 'Remove' : 'Add';

    const canShowToogle = this.canShowToogleBtn();

    return canShowToogle ? (
      <button className={`btn btn-primary btn-xs ${btnClass}`} onClick={this.handleClick}>
        {btnText}
      </button>
    ) : (
      <span>{value}</span>
    );
  }
}
