import React from 'react';
import GenericModal from '../../generics/ContainerModal';
import UiDatePicker from '../../../forms/inputs/UiDatepicker';

class EditSensorsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <GenericModal>
        <i className="fa fa-calendar"><UiDatePicker /></i>
      </GenericModal>
    );
  }
}

export default EditSensorsModal;
