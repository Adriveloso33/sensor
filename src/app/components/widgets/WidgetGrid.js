import React from 'react';
import PropTypes from 'prop-types';

import 'smartadmin-plugins/smartwidgets/jarvis.widget.ng2';

import defaults from './WidgetDefaults';

export default class WidgetGrid extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  componentDidMount() {
    $(this.grid).jarvisWidgets(defaults);
  }

  render() {
    return (
      <section
        id="widget-grid"
        ref={(grid) => {
          this.grid = grid;
        }}
      >
        {this.props.children}
      </section>
    );
  }
}
