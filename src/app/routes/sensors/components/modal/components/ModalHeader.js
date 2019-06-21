import React from 'react';
import PropTypes from 'prop-types';

export default function ModalHeader(props) {
  return (
    <div className="modal-header">
      <button type="button" className="close" onClick={props.handleCancel} data-dismiss="modal" aria-hidden="true">
        &times;
      </button>
      <h3 id="mySettingsLabel">
        {' '}
        <i className="glyphicon glyphicon-edit" /> Edit Row
      </h3>
      <p>Id: 0</p>
    </div>
  );
}

ModalHeader.propTypes = {
  handleCancel: PropTypes.func.isRequired,
};
