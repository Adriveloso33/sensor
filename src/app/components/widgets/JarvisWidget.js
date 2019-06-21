import React from 'react';

import classnames from 'classnames';

export default class JarvisWidget extends React.Component {
  static counter = 0;

  static defaultProps = {
    colorbutton: true,
    editbutton: true,
    togglebutton: true,
    deletebutton: true,
    fullscreenbutton: true,
    custombutton: false,
    collapsed: false,
    sortable: true,
    hidden: false,
    color: false,
    load: false,
    refresh: false,
  };

  constructor(props) {
    super(props);

    this.widgetId = getStr();
    this.widgetRef = React.createRef();
  }

  componentDidMount() {
    $(this.widgetRef.current)
      .find('.widget-body')
      .prepend('');

    this.setInitialHeight();
    this.attachEvents();
  }

  setInitialHeight = () => {
    if (this.props.height) {
      $(this.widgetRef.current)
        .find('.widget-body')
        .css({ height: this.props.height });
      this.notifyWindow();
    }
  };

  attachEvents = () => {
    // atach fullscreen event
    $(window).on('fullscreenWidget', () => {
      // set fullscreen class
      this.onFullScreen();
      this.notifyWindow();
    });

    // atach normal window event
    $(window).on('normalWidget', () => {
      // restore normal class
      this.onNormalMode();
      this.notifyWindow();
    });
  };

  notifyWindow = () => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  };

  onFullScreen = () => {
    const widget = $(this.widgetRef.current).find('.widget-body');
    $(widget).css({ height: '100% !important' });
  };

  onNormalMode = () => {
    this.setInitialHeight();
  };

  getParsedProps = () => {
    const widgetProps = {};

    [
      'colorbutton',
      'editbutton',
      'togglebutton',
      'deletebutton',
      'fullscreenbutton',
      'custombutton',
      'sortable',
    ].forEach((option) => {
      if (!this.props[option]) widgetProps[`data-widget-${option}`] = false;
    });

    ['hidden', 'collapsed'].forEach((option) => {
      if (this.props[option]) widgetProps[`data-widget-${option}`] = true;
    });

    ['refresh', 'load'].forEach((option) => {
      if (this.props[option]) widgetProps[`data-widget-${option}`] = this.props[option];
    });

    const colorClass = this.props.color ? `jarviswidget-color-${this.props.color}` : '';
    const classes = classnames(
      'jarviswidget',
      colorClass,
      {
        'jarviswidget-sortable': this.props.sortable === true,
      },
      this.props.className
    );

    widgetProps.className = classes;

    return widgetProps;
  };

  render() {
    const widgetProps = this.getParsedProps();

    return (
      <div ref={this.widgetRef} id={this.widgetId} {...widgetProps}>
        {this.props.children}
      </div>
    );
  }
}
