import React from 'react'

export default class UiSpinner extends React.Component {
  componentDidMount() {
    let options = {};
    let props = this.props;
    if (props.spinnerType == 'decimal') {
      options = {
        step: 0.01,
        numberFormat: "n"
      };
    } else if (props.spinnerType == 'currency') {
      options = {
        min: 5,
        max: 2500,
        step: 25,
        start: 1000,
        numberFormat: "C"
      };
    } else if (props.spinnerType == 'normal') {
      options = {
        step: 25,
        start: 1000,
        numberFormat: "C"
      };
    } else if (props.spinnerType == 'percent') {
      options = {
        min: 0,
        max: 100,
        step: 5,
        start: 10,
        numberFormat: "C"
      };
    }

    options.change = this.props.onChange;

    $(this.refs.input).spinner(options);
  }

  render() {
    const {spinnerType, ...props} =  {...this.props};
    return <input type="text" ref="input" {...props}/>
  }
}
