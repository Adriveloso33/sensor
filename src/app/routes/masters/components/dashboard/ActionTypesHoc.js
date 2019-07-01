import React from 'react';
import PropTypes from 'prop-types';
import Table from './Table';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';
import { errorMessage, warningMessage } from '../../../../components/notifications';
import { checkAuthError } from '../../../../components/auth/actions';
import { addTab, removeTab } from '../../../../components/tabs/TabsActions';

import ActionTypesForm from '../forms/actionTypes/ActionTypesForm';
import ActionTypesFormNew from '../forms/actionTypes/ActionsTypesFormNew';

class ActionTypesHoc extends React.Component {
  constructor(props) {
    super(props);
    this.config = {
      buttons: {
        edit: true,
        add: true,
      },
    };
    this.state = {
      loading: false,
      data: [],
    };
  }

  componentDidMount = () => {
    this.initData();
  };

  initData = () => {
    const { devicesUrl } = this.props || {};
    if (!devicesUrl) return;

    this.startLoading();
    axios
      .post(devicesUrl)
      .then((response) => {
        const { data } = response;
        if (data) {
          this.setState({
            data,
          });
        } else {
          warningMessage('Warning', 'There is no data for the grid.');
        }
        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        console.log(err);
        if (!axios.isCancel(err) && !checkAuthError(err)) errorMessage('Error', 'Error while retrieving table data.');
      });
  };

  startLoading = () => {
    this.setState({
      loading: true,
    });
    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    this.setState({
      loading: false,
    });
    store.dispatch(finishProcess(this.pid));
  };

  onEdit = (value) => {
    store.dispatch(removeTab('AT'));
    const rowId = value.id || {};
    this.loadTab(rowId);
  };

  onAdd = (value) => {
    store.dispatch(removeTab('ATN'));
    const rowId = value.id || {};
    this.newTab(rowId);
  };

  newTab = (rowId) => {
    const tabData = {
      id: 'ATN',
      active: true,
      title: 'ActionTypes New',
      component: ActionTypesFormNew,
      props: {
        report: 'ACTION_TYPES',
        title: 'ActionTypes',
        devicesUrlInsert: this.props.devicesUrlInsert,
        devicesUrlGet: this.props.devicesUrlGet,
        rowId,
      },
    };
    store.dispatch(addTab(tabData));
  };

  loadTab = (rowId) => {
    const tabData = {
      id: 'AT',
      active: true,
      title: 'ActionTypes Edit',
      component: ActionTypesForm,
      props: {
        report: 'ACTION_TYPES',
        title: 'ActionTypes',
        devicesUrlInsert: this.props.devicesUrlInsert,
        devicesUrlGet: this.props.devicesUrlGet,
        rowId,
      },
    };
    store.dispatch(addTab(tabData));
  };

  render() {
    return (
      <Table
        data={this.state.data}
        buttons={this.config.buttons}
        onEdit={this.onEdit}
        onAdd={this.onAdd}
        loading={this.state.loading}
      />
    );
  }
}

export default ActionTypesHoc;

ActionTypesHoc.propTypes = {
  devicesUrlInsert: PropTypes.string.isRequired,
  devicesUrlGet: PropTypes.string.isRequired,
  //devicesUrlSet: PropTypes.string.isRequired,
};
