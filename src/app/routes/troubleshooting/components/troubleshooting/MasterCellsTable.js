import React from 'react';
import PropTypes from 'prop-types';

 
import { JarvisWidget } from '../../../../components';
import { errorMessage } from '../../../../components/notifications';
import { checkAuthError } from '../../../../components/auth/actions';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';


import { numericCellRender } from '../../../../helpers/TableHelper';

import Loader from '../../../../components/dashboards/components/Loader';
import GridTable from 'wdna-grid-table';

import { getMasterCellsGrid } from '../../requests';

export default class MasterCellsTable extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      data: null,
      alias: {},
      alias_id: {},

      pagination: true,
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      // Listen for main filter changes
      if (nextState.mainFilter != currentState.mainFilter) {
        this.setData(nextState.mainFilter);
      }
    }
  }

  /**
   * Get and set table data from the server
   */
  setData = (filter) => {
    this.startLoading();
    getMasterCellsGrid(filter)
      .then((resp) => {
        this.setState({
          ...resp,
        });
        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        if (!axios.isCancel(err) && !checkAuthError(err)) errorMessage('Error', 'Error while retrieving table data.');
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
  };

  /**
   * Set new data for the grid
   */
  setUpNewData = (data) => {
    this.setState({
      data: data,
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

  togglePagination = (params) => {
    this.setState({
      pagination: !this.state.pagination,
    });
  };

  customCellRender = (params) => {
    const value = numericCellRender({}, params);

    return value;
  };

  render() {
    const { data, alias, pagination } = this.state;

    return (
      <JarvisWidget
        editbutton={false}
        togglebutton={false}
        fullscreenbutton={true}
        colorbutton={false}
        deletebutton={false}
        custombutton={true}
      >
        <header>
          <span className="widget-icon">
            <i className="fa fa-table" />
          </span>
          <h2>MasterCells Table</h2>
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
              contextMenuItems={[
                // general menu items
                {
                  name: 'Toggle pagination',
                  action: this.togglePagination,
                },
              ]}
            />
          )}
        </div>
      </JarvisWidget>
    );
  }
}

MasterCellsTable.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
