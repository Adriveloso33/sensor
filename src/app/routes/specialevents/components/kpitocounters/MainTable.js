import React from 'react';
import PropTypes from 'prop-types';

import { JarvisWidget } from '../../../../components';
import { errorMessage } from '../../../../components/notifications';
import { checkAuthError } from '../../../../components/auth/actions';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

import Loader from '../../../../components/dashboards/components/Loader';
import GridTable from 'wdna-grid-table';
import { numericCellRender } from '../../../../helpers/TableHelper';

import { getGridData } from '../../requests';

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      pagination: true,
      loading: true,
    };
  }

  componentDidMount() {
    this.setData(this.props.mainFilter);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      if (!nextState.mainFilter) return;

      // Listen for main filter changes
      if (nextState.mainFilter != currentState.mainFilter) {
        this.setData(nextState.mainFilter);
      }
    }
  }

  setData = (filter) => {
    this.startLoading();
    getGridData(filter)
      .then((resp) => {
        this.setState({
          ...resp,
        });
        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        if (!axios.isCancel(err) && !checkAuthError(err))
          errorMessage('Error', 'Error while retrieving check network elements.');
      });
  };

  /**
   * Ag-Grid ready Callback
   */
  onGridReady = (params) => {
    // map the api
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.autoFitColumns = params.autoFitColumns;

    setTimeout(() => {
      params.columnApi.autoSizeAllColumns();
    }, 100);
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

  togglePagination = (params) => {
    this.setState({
      pagination: !this.state.pagination,
    });
  };

  customCellRender = (params) => {
    const { threshold = {} } = this.state;
    const value = numericCellRender(threshold, params);

    return value;
  };

  render() {
    const { data, alias, pagination } = this.state;
    const { props } = this;

    return (
      <JarvisWidget
        editbutton={false}
        togglebutton={false}
        fullscreenbutton={true}
        colorbutton={false}
        deletebutton={false}
        custombutton={true}
        height={'calc(80vh)'}
      >
        <header>
          <span className="widget-icon">
            <i className="fa fa-table" />
          </span>
          <h2>{props.title}</h2>
        </header>
        <div className="widget-body" style={{ paddingTop: '0px' }}>
          <Loader show={this.state.loading} overlay={false} />
          {data && alias && (
            <GridTable
              data={data}
              alias={alias}
              onGridReady={this.onGridReady}
              search={true}
              exportBtn={true}
              filtersBtn={true}
              resetBtn={true}
              customCellRender={this.customCellRender}
              options={{
                enableFilter: true,
                enableStatusBar: true,
                alwaysShowStatusBar: false,
                rowSelection: 'multiple',
                pagination,
              }}
            />
          )}
        </div>
      </JarvisWidget>
    );
  }
}

MainTable.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
