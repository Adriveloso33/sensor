import React from "react";

import "select2/dist/js/select2.min.js";

export default class Select2 extends React.Component {
  componentDidMount() {
    $(this.refs.select).select2();

    // selected
    $(this.refs.select).on("select2:select", e => {
      var data = e.params.data;

      if (typeof this.props.onChange === "function") {
        this.props.onChange(this.props.name, data.selected, data.id);
      }
    });

    // unselected
    $(this.refs.select).on("select2:unselect", e => {
      var data = e.params.data;

      if (typeof this.props.onChange === "function") {
        this.props.onChange(this.props.name, data.selected, data.id);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    // Actualiza al cambiar los props
    if (nextProps.value) {
      $(this.refs.select)
        .val(nextProps.value)
        .trigger("change.select2");
    }
  }

  componentWillUnmount() {
    $(this.refs.select).select2("destroy");
  }

  render() {
    let { children, ...props } = this.props;
    return (
      <select {...props} ref="select">
        {children}
      </select>
    );
  }
}
