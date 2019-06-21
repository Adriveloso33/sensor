import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../../../../components/auth/Auth';
 
import { JarvisWidget } from '../../../../components';
import { errorMessage, warningMessage } from '../../../../components/notifications';
import { checkAuthError } from '../../../../components/auth/actions';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';


import { numericCellRender, parseSerieToChart, getContextMenuName } from '../../../../helpers/TableHelper';
import { getParentItem } from '../../../../helpers/GlobalHelper';

import Loader from '../../../../components/dashboards/components/Loader';
import GridTable from 'wdna-grid-table';

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      data: false,
      threshold: false,
      alias: false,
      alias_id: false,

      pagination: true,
      loading: false
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      let nextState = nextContext.parentState || {};
      let currentState = this.context.parentState || {};

      /* Table listen states */

      // Listen for new data
      if (nextState.tableNewData != currentState.tableNewData) {
        this.setUpNewData(nextState.tableNewData);
      }

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
    let { url } = this.props || {};
    if (!url) return;

    this.startLoading();
    axios
      .post(
        url,
        {
          api_token: Auth.getToken(),
          ...filter
        },
        { cancelToken: source.token }
      )
      .then((resp) => {
        const { data } = resp;

        if (data && data.data) {
          this.setState({
            data: data.data,
            alias: data.alias,
            alias_id: data.alias_id,
            threshold: data.threshold
          });
        } else {
          warningMessage('Warning', 'There is no data for the grid.');
        }
        this.finishLoading();
      })
      .catch((err) => {
        console.log(err);
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
      data: data
    });
  };

  startLoading = () => {
    this.setState({
      loading: true
    });

    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    this.setState({
      loading: false
    });

    store.dispatch(finishProcess(this.pid));
  };

  /* COLUMN MENU ITEMS */
  getAddToChartName = (params) => {    
    let contexName = getContextMenuName(this, params) || '';

    return `Add ${params.column.colDef.headerName}_${contexName} to the Chart`;
  };

  getShowInChartName = (params) => {
    let contexName = getContextMenuName(this, params) || '';

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
    const kpis = getParentItem(this, 'allKpis');
    const counters = getParentItem(this, 'counters');
    const { alias_id } = this.state || {};

    const itemId = alias_id ? alias_id[colId] : colId;

    const isKpi = kpis && kpis.find((kpi) => kpi.id === itemId);
    const isCounter = counters && counters.find((counter) => counter.id === itemId);
    const isValid = isKpi || isCounter;

    return isValid ? true : false;
  }

  showInvalidColumnError = () => {
    warningMessage('Warning', 'This column is not a valid KPI or Counter.');
  };

  togglePagination = (params) => {
    this.setState({
      pagination: !this.state.pagination
    });
  };

  customCellRender = (params) => {
    const { threshold } = this.state || {};
    const value = numericCellRender(threshold, params);

    return value;
  };

  render() {
    const { data, alias, threshold, pagination } = this.state;
    const { props } = this;

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
          <h2>{props.title}</h2>
        </header>
        <div className="widget-body" style={{ paddingTop: '0px' }}>
          <Loader show={this.state.loading} overlay={false} />
          {data &&
            alias &&
            threshold && (
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
                  pagination
                }}
                customCellRender={this.customCellRender}
                contextMenuItems={[
                  // general menu items
                  {
                    name: 'Toggle pagination',
                    action: this.togglePagination
                  },
                  {
                    // add serie to chart
                    name: this.getAddToChartName,
                    subMenu: [
                      {
                        name: 'Left Axis',
                        action: this.serieToLeftAxis
                      },
                      {
                        name: 'Right Axis',
                        action: this.serieToRightAxis
                      }
                    ]
                  },
                  {
                    // add serie to chart
                    name: this.getShowInChartName,
                    subMenu: [
                      {
                        name: 'Line Graph',
                        action: this.showInLineGraph
                      },
                      {
                        name: 'Column Graph',
                        action: this.showInColumnGraph
                      }
                    ]
                  }
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
  updateParent: PropTypes.func.isRequired
};
