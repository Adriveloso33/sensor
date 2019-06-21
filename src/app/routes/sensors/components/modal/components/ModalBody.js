import React from 'react';
import PropTypes from 'prop-types';
import SensorsForm from '../../forms/sensors/SensorsForm';
import SettingsForm from '../../forms/settings/SettingsForm';
import AlarmsForm from '../../forms/alarms/AlarmsForm';
import ConfigurationsForm from '../../forms/configurations/ConfigurationsForm';
import FirmwaresForm from '../../forms/firmwares/FirmwaresForm';
import GraphForm from '../../forms/graph/GraphForm';
import RedirectionsForm from '../../forms/redirections/RedirectionsForm';
import TypesForm from '../../forms/types/TypesForm';
import VariablesForm from '../../forms/variables/VariablesForm';

export default function ModalBody(props) {
  switch (props.form) {
    case 'SensorsForm':
      return (
        <div className="modal-body">
          <SensorsForm />
        </div>
      );
    case 'SettingsForm':
      return (
        <div className="modal-body">
          <SettingsForm />
        </div>
      );
    case 'AlarmsForm':
      return (
        <div className="modal-body">
          <AlarmsForm />
        </div>
      );
    case 'ConfigurationsForm':
      return (
        <div className="modal-body">
          <ConfigurationsForm />
        </div>
      );
    case 'FirmwaresForm':
      return (
        <div className="modal-body">
          <FirmwaresForm />
        </div>
      );
    case 'GraphForm':
      return (
        <div className="modal-body">
          <GraphForm />
        </div>
      );
    case 'RedirectionsForm':
      return (
        <div className="modal-body">
          <RedirectionsForm />
        </div>
      );
    case 'TypesForm':
      return (
        <div className="modal-body">
          <TypesForm actionButtons={props.actionButtons} toolPanelButtons={props.toolPanelButtons} />
        </div>
      );
    case 'VariablesForm':
      return (
        <div className="modal-body">
          <VariablesForm />
        </div>
      );
    default:
      break;
  }
}

ModalBody.propTypes = {
  form: PropTypes.string.isRequired
};
