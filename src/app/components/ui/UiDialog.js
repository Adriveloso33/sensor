import React from 'react';
import ReactDOM from 'react-dom';

$.widget(
  'ui.dialog',
  $.extend({}, $.ui.dialog.prototype, {
    _title: function(title) {
      if (!this.options.title) {
        title.html('&#160;');
      } else {
        title.html(this.options.title);
      }
    }
  })
);

export default class UiDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.show == true) {
      this.openDialog();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show == true) {
      this.openDialog();
    }
  }

  openDialog = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    let cancelCb = false;
    if (typeof this.props.onCancel === 'function') cancelCb = this.props.onCancel;
    let { options } = this.props;

    let $dialog = $('<div>').dialog({
      title: `<div class="widget-header">${this.props.header}</div>`,
      width: this.props.width || 400,
      modal: !!this.props.modal,
      ...options,
      close: function(e) {
        if (cancelCb) cancelCb();

        ReactDOM.unmountComponentAtNode(this);
        $(this).remove();
      }
    });

    let closeDialog = (e) => {
      e.preventDefault();
      $dialog.dialog('close');
    };

    let _content = this.props.content;
    let _contentProps = this.props.contentProps;

    let content = React.createElement(_content.type, {
      closeDialog: closeDialog,
      ..._contentProps
    });

    ReactDOM.render(content, $dialog[0]);
  };

  render() {
    return null;
  }
}

UiDialog.defaultProps = {
  show: false
};
