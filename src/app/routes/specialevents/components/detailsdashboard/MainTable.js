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
      data: [],
      alias: {},
      hidden_cols: [],
      threshold: {},
      pagination: true,
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      if (!nextState.mainFilter) return;

      const nextFilterSource = nextState.mainFilter.sourceType;
      if (nextFilterSource !== this.props.sourceType) return; // is not with me :)

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
          errorMessage('Error', 'Error while retrieving special events list.');
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

  getColumnValue = (columnName, rowData) => {
    const colId = this.getColumnByAlias(columnName);
    return rowData[colId];
  };

  getColumnByAlias = (aliasValue) => {
    const { alias = {} } = this.state;

    let columnId = null;
    Object.keys(alias).forEach((key) => {
      const value = alias[key];
      if (value === aliasValue) columnId = key;
    });

    return columnId;
  };

  getInitialFilterState = (rowData) => {
    return {
      vendor: this.getColumnValue('vendor', rowData),
      vendor_id: this.getColumnValue('vendor_id', rowData),
      region_id: this.getColumnValue('region_id', rowData),
      id_event: this.getColumnValue('id_event', rowData),
      event_ne_type: this.getColumnValue('event_ne_type', rowData),
      type: 'single',
      report_graph: 'dashboard',
      graphConfig: {},
      arrFilterNe: [],
    };
  };
  customCellRender = (params) => {
    const { threshold } = this.state || {};
    const value = numericCellRender(threshold, params);

    return value;
  };

  render() {
    const { data, alias, threshold, hidden_cols, pagination } = this.state;
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
          {data && alias && hidden_cols && (
            <GridTable
              data={data}
              alias={alias}
              hiddenCols={hidden_cols}
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
