import React from 'react';
// import PropTypes from 'prop-types';
import MainTable from './MainTable';
// import Loader from './'
// import MainDashboard from '../../containers/MainDashboard';
// import { addTab } from '../../../../components/tabs/TabsActions';

export default function Table(props) {
  const toolPanelButtons = getPanelButtons(props);
  const actionButtons = getActionsButtons(props);

  const { buttons } = props || {};
  const { toogleItem } = buttons || {};

  return <MainTable toogleItem={toogleItem} actionButtons={actionButtons} toolPanelButtons={toolPanelButtons} />;
}

function getActionsButtons(props) {
  const actionButtons = [];

  const { buttons } = props || {};
  const { edit, copy, duplicate, assignSensor, graph } = buttons || {};

  if (edit) actionButtons.push(buttonEdit(props));
  if (copy) actionButtons.push(buttonCopy(props));
  if (duplicate) actionButtons.push(buttonDuplicate(props));
  if (assignSensor) actionButtons.push(buttonAssignSensor(props));
  if (graph) actionButtons.push(buttonGraph(props));

  return actionButtons;
}

function getPanelButtons(props) {
  const toolPanelButtons = [];

  const { buttons } = props || {};
  const { add, removeSelected } = buttons || {};

  if (add) toolPanelButtons.push(buttonAdd(props));
  if (removeSelected) toolPanelButtons.push(buttonRemoveSelected(props));

  return toolPanelButtons;
}

function buttonEdit(props) {
  return {
    text: 'Edit',
    icon: 'glyphicon glyphicon-edit',
    class: 'btn btn-info btn-xs',
    action: props.onEdit,
  };
}

function buttonDuplicate() {
  return {
    text: 'Duplicate',
    icon: 'glyphicon glyphicon-duplicate',
    class: 'btn btn-warning btn-xs',
  };
}

function buttonCopy() {
  return {
    text: 'Copy',
    icon: 'glyphicon glyphicon-duplicate',
    class: 'btn btn-info btn-xs',
  };
}

function buttonAssignSensor() {
  return {
    text: 'Assign Sensor',
    icon: 'glyphicon glyphicon-edit',
    class: 'btn btn-warning btn-xs',
  };
}

function buttonGraph() {
  return {
    text: 'Graph',
    icon: 'glyphicon glyphicon-edit',
    class: 'btn btn-warning btn-xs',
  };
}

function buttonAdd() {
  return {
    text: 'Add',
    class: 'grid-reset-btn',
    action: props.onAdd,
  };
}

function buttonRemoveSelected() {
  return {
    text: 'Remove Selected',
    class: 'grid-reset-btn',
  };
}
