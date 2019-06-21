import React from 'react';
import PropTypes from 'prop-types';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick = (e) => {
    e.preventDefault();

    this.context.router.history.push('/configuration/user');
  };

  render() {
    return (
      <div id="settings_button" className={this.props.className}>
        <span>
          <a title="Personal Settings" data-toggle="tooltip" data-placement="bottom" onClick={this.handleClick}>
            <i className="fa fa-user txt-color-white" />
          </a>
        </span>
      </div>
    );
  }
}

Settings.contextTypes = {
  router: PropTypes.object.isRequired,
};
