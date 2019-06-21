import React from 'react';

import GridTable from 'wdna-grid-table';

import { JarvisWidget } from '../../../../components';
import { SmartMessageBox } from '../../../../components/utils/actions/MessageActions';

import EventDashboard from '../../containers/EventDashboard';
import DetailsDashboard from '../../containers/DetailsDashboard';
import MainForm from '../specialeventform/MainForm';

import { errorMessage, successMessage } from '../../../../components/notifications';
import { checkAuthError } from '../../../../components/auth/actions';
import { hasPermission } from '../../../../components/user/UserActions';

import { getErrorMessage } from '../../../../components/utils/ResponseHandler';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

import { createTab } from '../../../../helpers/TabsHelper';

import Loader from '../../../../components/dashboards/components/Loader';

import { getSpecialEventsList, getNumberOfGraphs, deleteSPE, editSPE } from '../../requests';

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      data: null,
      alias: null,
      hidden_cols: null,

      pagination: true,
      loading: true,
    };
  }

  componentDidMount() {
    this.setData();
  }

  setData = () => {
    this.startLoading();
    getSpecialEventsList()
      .then((resp) => {
        this.addActions(resp);
        this.setState({
          ...resp,
        });
        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        if (!axios.isCancel(err) && !checkAuthError(err)) {
          errorMessage('Error', 'Error while retrieving special events list.');
        }
      });
  };

  addActions = (table) => {
    table.alias.COL_0 = 'Action Buttons';
    table.data = table.data.map((row) => {
      return {
        ...row,
        COL_0: 'verga',
      };
    });
  };

  requestNumberOfGraphs = (rowData, cb) => {
    const vendorColumn = this.getColumnByAlias('VENDOR');
    const vendor = rowData[vendorColumn];

    this.startSingleLoading();
    getNumberOfGraphs(vendor)
      .then((graphsData) => {
        this.finishSingleLoading();
        if (typeof cb === 'function') cb(graphsData);
      })
      .catch(() => {
        this.finishSingleLoading();
        errorMessage('Error', 'Error retrieving special event data.');
      });
  };

  startSingleLoading = () => {
    this.setState({
      loading: true,
    });
  };

  finishSingleLoading = () => {
    this.setState({
      loading: false,
    });
  };

  onGridReady = (params) => {
    // map the api
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.autoFitColumns = params.autoFitColumns;

    setTimeout(() => {
      params.columnApi.autoSizeAllColumns();
    }, 500);
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

  togglePagination = () => {
    this.setState((prevState) => ({
      pagination: !prevState.pagination,
    }));
  };

  loadDashboard = (rowData) => {
    if (this.state.loading) return;

    this.requestNumberOfGraphs(rowData, (graphsData) => {
      const initialFilterState = this.getInitialFilterStateForDashboard(rowData);
      this.loadNewTab(EventDashboard, { graphsData, initialFilterState }, rowData);
    });
  };

  loadDetails = (rowData) => {
    if (this.state.loading) return;

    const initialFilterState = this.getInitialFilterStateForDetails(rowData);
    this.loadNewTab(DetailsDashboard, { initialFilterState }, rowData);
  };

  loadNewTab = (component, props = {}, rowData) => {
    const tabData = {
      title: this.getColumnValue('name_spe', rowData),
      active: true,
      component,
      props,
    };

    this.dispatchTab(tabData);
  };

  dispatchTab = (tabData) => {
    createTab(tabData);
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

  getColumnById = (idValue) => {
    const { alias = {} } = this.state;

    let columnAlias = null;
    Object.keys(alias).forEach((key) => {
      if (key === idValue) columnAlias = alias[key];
    });

    return columnAlias;
  };

  getInitialFilterStateForDashboard = (rowData) => {
    return {
      vendor: this.getColumnValue('vendor', rowData),
      vendor_id: this.getColumnValue('vendor_id', rowData),
      region_id: this.getColumnValue('region_id', rowData),
      id_event: this.getColumnValue('id_event', rowData),
      event_ne_type: this.getColumnValue('event_ne_type', rowData),
      name_spe: this.getColumnValue('name_spe', rowData),
      type: 'single',
      report_graph: 'dashboard',
      graphConfig: {},
      arrFilterNe: [],
    };
  };

  getInitialFilterStateForDetails = (rowData) => {
    const initialState = {};

    const { hidden_cols = [] } = this.state;
    hidden_cols.forEach((colId) => {
      const colAlias = this.getColumnById(colId);
      const value = this.getColumnValue(colAlias, rowData);

      initialState[colAlias] = value;
    });

    return initialState;
  };

  buildData = (rowData, dataKeys) => {
    const { alias } = this.state;
    const data = {};
    dataKeys.forEach((key) => {
      const column = Object.keys(alias).find((col) => {
        return alias[col] === key;
      });
      data[key] = rowData[column];
    });
    data.user_id = store.getState().getIn(['user']).id;
    return data;
  };

  deleteAction = (rowData) => {
    const dataKeys = ['vendor_id', 'region_id', 'id_event'];
    SmartMessageBox(
      {
        title: "<i class='fa fa-trash' style='color:red'></i> Delete",
        content: 'Are you sure?',
        buttons: '[No][Yes]',
      },
      (ButtonPressed) => {
        // Borrado
        if (ButtonPressed === 'Yes') {
          deleteSPE(this.buildData(rowData, dataKeys))
            .then(() => {
              successMessage('Success', 'Special Event succesfully deleted', 5000);
              this.setData();
            })
            .catch((error) => {
              errorMessage('Error', getErrorMessage(error));
            });
        }
      }
    );
  };

  editAction = (rowData) => {
    const dataKeys = ['vendor', 'vendor_id', 'region_id', 'id_event'];
    editSPE(this.buildData(rowData, dataKeys))
      .then((resp) => {
        const tabId = getStr();
        const tableData = resp.table.map((row) => {
          return {
            COL_1: row.EVENT_TYPE,
            COL_2: row.SITE_TYPE,
            COL_3: row.SITE_CLASSIFICATION,
            COL_4: row.ELEMENT,
          };
        });
        const dataTab1 = {
          id: tabId,
          title: 'Edit Special Event',
          active: true,
          component: MainForm,
          props: {
            tabId,
            newSPE: false,
            dates: resp.calendar,
            eventDescription: resp.description,
            eventName: resp.name_spe,
            filterLevel: resp.filter_type,
            id_event: resp.id_event,
            region_id: resp.region_id,
            vendor: resp.vendor,
            vendor_id: resp.vendor_id,
            tableData,
          },
        };
        createTab(dataTab1);
      })
      .catch((error) => {
        errorMessage('Error', getErrorMessage(error));
      });
  };

  getActionButtons = (row) => {
    const actionButtons = [];
    // const user = this.getUser(row);
    // if (hasPermission('delete_alarmcategory') || user == store.getState().getIn(['user']).id) {
    //   actionButtons.push({
    //     text: 'Delete',
    //     icon: 'glyphicon glyphicon-remove',
    //     action: () => {
    //       this.deleteAction(row);
    //     },
    //     class: 'btn btn-danger btn-xs',
    //   });
    // }
    // if (hasPermission('edit_spe') || user == store.getState().getIn(['user']).id) {
    //   actionButtons.push({
    //     text: 'Edit',
    //     icon: 'glyphicon glyphicon-edit',
    //     action: () => {
    //       this.editAction(row);
    //     },
    //     class: 'btn btn-info btn-xs',
    //   });
    // }
    actionButtons.push({
      text: 'Dashboard',
      icon: 'fa fa-bar-chart',
      action: () => {
        this.loadDashboard(row);
      },
      class: 'btn btn-success btn-xs',
    });
    actionButtons.push({
      text: 'Details',
      icon: 'fa fa-info-circle',
      action: () => {
        this.loadDetails(row);
      },
      class: 'btn btn-info btn-xs',
    });
    return actionButtons;
  };

  getUser = (data) => {
    const { alias } = this.state;
    const userCol = Object.keys(alias).find((key) => {
      return alias[key] === 'owner';
    });
    return data[userCol];
  };

  getCellValue = (params) => {
    const { data, alias } = this.state;
    const idEventCol = Object.keys(alias).find((key) => {
      return alias[key] === 'id_event';
    });
    const valueRow = data.find((row) => {
      return row[idEventCol] === params.data[idEventCol];
    });
    return valueRow[params.colDef.field];
  };

  customCellRender = (params) => {
    if (params.colDef.field === 'COL_0') {
      return (
        <span>
          {this.getActionButtons(params.data).map((button) => {
            return <TableButton {...button} />;
          })}
        </span>
      );
    }

    return <span>{this.getCellValue(params)}</span>;
  };

  render() {
    const { data, alias, hidden_cols, pagination } = this.state;
    const { props } = this;

    return (
      <JarvisWidget
        custombutton
        fullscreenbutton
        editbutton={false}
        togglebutton={false}
        colorbutton={false}
        deletebutton={false}
        height="calc(80vh)"
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
              search
              exportBtn
              filtersBtn
              resetBtn
              data={data}
              alias={alias}
              hiddenCols={hidden_cols}
              onGridReady={this.onGridReady}
              options={{
                pagination,
                suppressColumnVirtualisation: false,
                enableFilter: true,
                enableStatusBar: true,
                alwaysShowStatusBar: false,
                rowSelection: 'multiple',
              }}
              customCellRendererFramework={this.customCellRender}
            />
          )}
        </div>
      </JarvisWidget>
    );
  }
}

function TableButton(props) {
  return (
    <button type="button" className={props.class} onClick={props.action}>
      <i className={props.icon} /> {props.text}
    </button>
  );
}
