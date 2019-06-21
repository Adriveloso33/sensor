import React from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import ConfigurationsForm from '../forms/configurations/ConfigurationsForm';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';
import { errorMessage, warningMessage } from '../../../../components/notifications';
import { checkAuthError } from '../../../../components/auth/actions';
import { addTab } from '../../../../components/tabs/TabsActions';

class ConfigurationsHoc extends React.Component {
  constructor(props) {
    super(props);
    this.config = {
      buttons: {
        edit: true,
        add: true,
        removeSelected: true,
        toogleItem: true,
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
    const rowId = value.id || {};
    this.loadTab(rowId);
  };

  loadTab = (rowId) => {
    const tabData = {
      id: getStr(),
      active: true,
      title: 'Configurations Edit',
      component: ConfigurationsForm,
      props: {
        report: 'CONFIGURATIONS',
        title: 'Configurations',
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

export default ConfigurationsHoc;

ConfigurationsHoc.propTypes = {
  devicesUrlInsert: PropTypes.string.isRequired,
  devicesUrlGet: PropTypes.string.isRequired,
};
