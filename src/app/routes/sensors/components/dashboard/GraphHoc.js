import React from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import GraphForm from '../forms/graph/GraphForm';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';
import { errorMessage, warningMessage } from '../../../../components/notifications';
import { checkAuthError } from '../../../../components/auth/actions';
import { addTab } from '../../../../components/tabs/TabsActions';

class GraphHoc extends React.Component {
  constructor(props) {
    super(props);
    this.config = {
      buttons: {
        graph: true,
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

  onGraph = (value) => {
    const rowId = value.id || {};
    this.loadTab(rowId);
  };

  loadTab = (rowId) => {
    const tabData = {
      id: getStr(),
      active: true,
      title: 'Graph Edit',
      component: GraphForm,
      props: {
        report: 'GRAPH',
        title: 'Graph',
        devicesUrlInsert: this.props.devicesUrlInsert,
        devicesUrlGet: this.props.devicesUrlGet,
        rowId,
      },
    };

    store.dispatch(addTab(tabData));
  };

  render() {
    return (
      <Table data={this.state.data} buttons={this.config.buttons} onGraph={this.onGraph} loading={this.state.loading} />
    );
  }
}

export default GraphHoc;

GraphHoc.propTypes = {
  devicesUrlInsert: PropTypes.string.isRequired,
  devicesUrlGet: PropTypes.string.isRequired,
};
