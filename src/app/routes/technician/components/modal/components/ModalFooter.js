import React from 'react';
import PropTypes from 'prop-types';

export default function ModalFooter(props) {
  return (
    <div className="modal-footer">
      <div className="pull-left">
        <button type="button" className="btn btn-primary" onClick={props.handleReset}>
          Reset
        </button>
      </div>
      <button type="button" className="btn btn-primary" onClick={props.submit}>
        Save
      </button>
      <button type="button" className="btn btn-primary" onClick={props.handleCancel} data-dismiss="modal">
        Close
      </button>
    </div>
  );
}

ModalFooter.propTypes = {
  handleReset: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};
