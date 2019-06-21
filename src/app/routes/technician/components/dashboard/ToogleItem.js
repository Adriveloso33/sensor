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

  render() {
    const { selected } = this.state || {};
    const btnClass = selected ? 'bg-color-red' : 'bg-color-green',
      btnText = selected ? 'Remove' : 'Select';

    return (
      <button className={`btn btn-primary btn-xs ${btnClass}`} onClick={this.handleClick}>
        {btnText}
      </button>
    );
  }
}
