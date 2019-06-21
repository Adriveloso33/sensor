import React from 'react';
import PropTypes from 'prop-types';

 
import { JarvisWidget } from '../../../../components';
import { errorMessage, warningMessage } from '../../../../components/notifications';
import { checkAuthError } from '../../../../components/auth/actions';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';


import { numericCellRender, parseSerieToChart, getContextMenuName } from '../../../../helpers/TableHelper';
import { getParentState } from '../../../../helpers/GlobalHelper';

import Loader from '../../../../components/dashboards/components/Loader';
import GridTable from 'wdna-grid-table';

import { getMainTable } from '../../requests';

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();
    this.filterBy = null;

    this.state = {
      data: null,

      alias: {},

      pagination: true,
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      let nextState = nextContext.parentState || {};
      let currentState = this.context.parentState || {};

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
    getMainTable(filter)
      .then((resp) => {
        this.setState(
          {
            ...resp,
          },
          () => {
            this.setFilterBy(filter);
          }
        );

        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        if (!axios.isCancel(err) && !checkAuthError(err)) errorMessage('Error', 'Error while retrieving table data.');
      });
  };

  setFilterBy = (filter = {}) => {
    const { groupLevel1 } = filter;
    const { alias = {} } = this.state;

    Object.keys(alias).forEach((colId) => {
      const value = alias[colId];
      if (value === groupLevel1) this.filterBy = colId;
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

  /* COLUMN MENU ITEMS */
  getAddToChartName = (params) => {
    const contexName = getContextMenuName(this, params) || '';

    return `Add ${params.column.colDef.headerName}_${contexName} to the Chart`;
  };

  getShowInChartName = (params) => {
    const contexName = getContextMenuName(this, params) || '';

    return `Show ${params.column.colDef.headerName}_${contexName} in the Chart`;
  };

  /**
   * Send new data to the chart
   */
  showInChart = (params, graphType = 'column') => {
    const { colId } = params.column;

    if (!this.canShowColumn(colId)) {
      this.showInvalidColumnError();
      return;
    }

    const serie = parseSerieToChart(this, params, graphType);
    if (serie) this.sendNewDataToChar(serie);
  };

  /**
   * Send a specific serie to the chart
   */
  addSerieToChart = (params, axisNumber) => {
    const { colId } = params.column;

    if (!this.canShowColumn(colId)) {
      this.showInvalidColumnError();
      return;
    }

    const serie = parseSerieToChart(this, params, 'spline', axisNumber);

    if (serie) this.sendSerieToChar(serie);
  };

  serieToLeftAxis = (params) => {
    this.addSerieToChart(params, 0);
  };

  serieToRightAxis = (params) => {
    this.addSerieToChart(params, 1);
  };

  showInLineGraph = (params) => {
    this.showInChart(params, 'spline');
  };

  showInColumnGraph = (params) => {
    this.showInChart(params, 'column');
  };

  /* send a specific column as serie to graph */
  sendSerieToChar = (serie) => {
    this.context.updateParent({ graphSerieData: serie });
  };

  /* send new data to the graph */
  sendNewDataToChar = (data) => {
    this.context.updateParent({ graphNewData: data });
  };

  canShowColumn(colId) {
    const { alias = {} } = this.state;
    const columnHeader = alias[colId];

    const notAllowItems = ['DATE', 'WEEK', 'MONTH', 'TIME'];
    if (notAllowItems.indexOf(columnHeader) != -1) return false;

    const { filterLevels = [] } = getParentState(this) || {};
    const isValidItem = filterLevels.find((filterInfo) => filterInfo.text === columnHeader) == null;

    return isValidItem;
  }

  showInvalidColumnError = () => {
    warningMessage('Warning', 'This column is not a valid KPI or Counter.');
  };

  togglePagination = () => {
    this.setState({
      pagination: !this.state.pagination,
    });
  };

  customCellRender = (params) => {
    const { threshold } = this.state || {};
    const value = numericCellRender(threshold, params);

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
          <h2>Table</h2>
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
              options={{
                enableFilter: true,
                enableStatusBar: true,
                alwaysShowStatusBar: false,
                rowSelection: 'multiple',
                pagination,
              }}
              customCellRender={this.customCellRender}
              contextMenuItems={[
                // general menu items
                {
                  name: 'Toggle pagination',
                  action: this.togglePagination,
                },
                {
                  // add serie to chart
                  name: this.getAddToChartName,
                  subMenu: [
                    {
                      name: 'Left Axis',
                      action: this.serieToLeftAxis,
                    },
                    {
                      name: 'Right Axis',
                      action: this.serieToRightAxis,
                    },
                  ],
                },
                {
                  // add serie to chart
                  name: this.getShowInChartName,
                  subMenu: [
                    {
                      name: 'Line Graph',
                      action: this.showInLineGraph,
                    },
                    {
                      name: 'Column Graph',
                      action: this.showInColumnGraph,
                    },
                  ],
                },
              ]}
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
