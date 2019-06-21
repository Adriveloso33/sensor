import React from 'react';
import PropTypes from 'prop-types';
import { SmartMessageBox } from '../../../components/utils/actions/MessageActions';
import { WidgetGrid, JarvisWidget } from '../../../components';
import GridTable from 'wdna-grid-table';
import { insertEntTable, updateEntTable, deleteEntTable, getGridInfo } from '../requests/index';
import { warningMessage, errorMessage, successMessage } from '../../../components/notifications/index';
import { getErrorMessage } from '../../../components/utils/ResponseHandler';
import Loader from '../../../components/dashboards/components/Loader';
import { initProcess, finishProcess } from '../../../components/scheduler/SchedulerActions';

export default class TableConfiguration extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      alias: false,
      pagination: true,
      resetTable: 0,
      floatingFilter: false,
      loading: true,
    };
  }

  componentDidMount() {
    this.load();
  }

  load = () => {
    this.startLoading();
    const { source_name, db_schema, table_name } = this.props;
    getGridInfo({ source_name, db_schema, table_name })
      .then((resp) => {
        this.getColData(resp);
        this.addActions(resp);
        this.fixData(resp.data);
        let data_org = _.cloneDeep(resp.data);
        this.setState({
          data_org,
          ...resp,
        });

        this.finishLoading();
      })
      .catch((error) => {
        console.log(error);
        errorMessage('Error', error.message.message);
        this.finishLoading();
      });
  };

  getColData = (resp) => {
    const { alias, hidden_cols, auto } = resp;
    let editableCols = [];
    Object.keys(alias).forEach((key) => {
      if (hidden_cols.indexOf(key) < 0 && auto.indexOf(key) < 0) editableCols.push(key);
    });
    this.setState({
      editableCols,
    });
  };

  addActions = (table) => {
    table.alias.COL_0 = 'Action Buttons';
    table.data = table.data.map((row) => {
      return {
        ...row,
        COL_0: 'raw',
      };
    });
  };

  //null -> string null and empty string -> undefined to avoid issues with ag grid
  fixData = (data) => {
    data.forEach((row, idx) => {
      this.state.editableCols.forEach((key) => {
        const value = row[key];
        if (value === null) {
          data[idx][key] = 'null';
        }
        if ((typeof value == typeof NaN && isNaN(value)) || value === '' || value === '') {
          data[idx][key] = undefined;
        }
        if (_.isNumber(value) && !isNaN(value)) data[idx][key] = value.toString();
      });
    });
  };

  deleteRow = (rowIndex) => {
    SmartMessageBox(
      {
        title: "<i class='fa fa-trash' style='color:red'></i> Delete",
        content: 'Are you sure?',
        buttons: '[No][Yes]',
      },
      (ButtonPressed) => {
        // Borrado
        if (ButtonPressed == 'Yes') {
          const { alias, data, data_org } = this.state;
          if (data[rowIndex].COL_0 == 'new') {
            this.clearChanges();
            return;
          }
          const source_name = this.customValue(this.props.source_name);
          const table_name = this.customValue(this.props.table_name);
          let row = data_org[rowIndex];
          let column_value = {};
          delete row.COL_0;
          Object.keys(row).forEach((key) => {
            column_value[alias[key]] = this.customValue(row[key]);
          });
          deleteEntTable({ source_name, table_name, column_value })
            .then((resp) => {
              successMessage('Success', 'Row successfully deleted', 5000);
              this.load();
            })
            .catch((error) => {
              console.log(error);
              errorMessage('Error', error.message.message || error.message || error);
            });
        }
      }
    );
  };

  editRow = (rowIndex) => {
    const editedRow = this.getEditedRow();
    if (editedRow >= 0 && editedRow != rowIndex) {
      warningMessage('Warning', 'Please save your changes before doing that');
      return;
    }
    const { editableCols } = this.state;
    this.gridApi.setFocusedCell(rowIndex, editableCols[0]);
    this.gridApi.startEditingCell({ rowIndex, colKey: editableCols[0] });
  };

  saveRow = (row, rowIndex) => {
    const { alias, data_org, editableCols } = this.state;
    const source_name = this.customValue(this.props.source_name);
    const table_name = this.customValue(this.props.table_name);
    let column_value = {};
    Object.keys(row).forEach((key) => {
      if (editableCols.indexOf(key) > -1) column_value[alias[key]] = this.customValue(row[key]);
    });
    if (row.COL_0 == 'new') {
      var params = { source_name, table_name, column_value };
      var query = insertEntTable;
    } else {
      let column_value_org = {};
      Object.keys(row).forEach((key) => {
        column_value_org[alias[key]] = this.customValue(data_org[rowIndex][key]);
      });
      delete column_value_org['Action Buttons'];
      var params = { source_name, table_name, column_value_org, column_value_upd: column_value };
      var query = updateEntTable;
    }
    query(params)
      .then((resp) => {
        successMessage('Success', 'Table updated correctly', 5000);
        this.load();
      })
      .catch((error) => {
        console.log(error);
        errorMessage('Error', error.message.message || error.message || error);
      });
  };

  newRow = () => {
    if (this.getEditedRow() >= 0) {
      warningMessage('Warning', 'Please save your changes before doing that');
      return;
    }
    const { alias, data } = this.state;
    let row = {};
    Object.keys(alias).forEach((key) => {
      row[key] = null;
    });
    row.COL_1 = '';
    row.COL_0 = 'new';
    let newData = _.cloneDeep(data);
    newData.push(row);
    this.setState({
      data: newData,
    });
  };

  customValue = (value) => {
    if (value === null || value === 'null') {
      return '#null#';
    }
    if (value === '' || value === ' ' || value === undefined) {
      return '#empty#';
    }
    return value;
  };

  togglePagination = (params) => {
    this.setState({
      pagination: !this.state.pagination,
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

  onGridReady = (params) => {
    // map the api
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.autoFitColumns = params.autoFitColumns;

    setTimeout(() => {
      params.columnApi.autoSizeAllColumns();
    }, 500);
  };

  rowChanged = (row) => {
    const { data_org, data } = this.state;
    if (!_.isEqual(data_org[row.rowIndex], data[row.rowIndex])) {
      if (data[row.rowIndex].COL_0 == 'raw') data[row.rowIndex].COL_0 = 'edited';
      this.setState(
        {
          data,
        },
        () => {
          this.gridApi.redrawRows({ rowNodes: [row.node] });
        }
      );
    }
  };

  editControl = (row) => {
    const editedRow = this.getEditedRow();
    if (editedRow >= 0 && editedRow != row.rowIndex) {
      this.gridApi.stopEditing();
    }
  };

  getEditedRow = () => {
    const { data } = this.state;
    return data.findIndex((row) => {
      return row.COL_0 != 'raw';
    });
  };

  customCellRender = (params) => {
    let { value, rowIndex } = params;
    const { data } = this.state;
    if (params.colDef.field === 'COL_0') {
      params.columnApi.autoSizeColumn('COL_0');
      return (
        <span>
          {this.getActionButtons(params.data, rowIndex).map((button) => {
            return <TableButton {...button} />;
          })}
        </span>
      );
    }
    const truevalue = data[rowIndex][params.colDef.field];
    if (truevalue === null) {
      params.node.setDataValue(params.colDef.field, 'null');
      return 'null';
    }
    if ((typeof truevalue == typeof NaN && isNaN(truevalue)) || truevalue === ' ' || truevalue === '') {
      params.node.setDataValue(params.colDef.field, undefined);
      return ' ';
    }
    return <span>{value}</span>;
  };

  getActionButtons = (row, idx) => {
    let actionButtons = [];
    actionButtons.push({
      text: 'Edit',
      icon: 'glyphicon glyphicon-edit',
      action: () => {
        this.editRow(idx);
      },
      class: 'btn btn-warning btn-xs',
    });
    actionButtons.push({
      text: 'Save',
      icon: 'glyphicon glyphicon-floppy-disk',
      action: () => {
        this.saveRow(row, idx);
      },
      class: 'btn btn-info btn-xs',
      disabled: row.COL_0 == 'raw',
    });
    actionButtons.push({
      text: 'Delete',
      icon: 'glyphicon glyphicon-remove',
      action: () => {
        this.deleteRow(idx);
      },
      class: 'btn btn-danger btn-xs',
    });
    return actionButtons;
  };

  clearChanges = () => {
    if (this.getEditedRow() < 0) {
      return;
    }
    this.setState({
      data: _.cloneDeep(this.state.data_org),
    });
  };

  rowClass = (paramas) => {
    if (paramas.data.COL_0 != 'raw') {
      return 'edited-row';
    } else {
      return '';
    }
  };

  render() {
    const { data, alias, hidden_cols, editableCols, pagination, loading } = this.state;
    return (
      <div id="content">
        {/* widget grid */}
        <WidgetGrid>
          <div className="row">
            <article className="col-sm-12 col-md-12 col-lg-12">
              <JarvisWidget
                editbutton={false}
                togglebutton={false}
                editbutton={false}
                fullscreenbutton={false}
                colorbutton={false}
                deletebutton={false}
                height={'calc(80vh)'} // normal style
              >
                <header>
                  <span className="widget-icon">
                    <i className="fa fa-edit" />
                  </span>
                  <h2>{this.props.table_name}</h2>
                </header>

                {/* widget div*/}
                <div>
                  {/* widget content */}
                  <div className="widget-body">
                    <Loader show={loading} overlay={false} />
                    {data && (
                      <GridTable
                        data={data}
                        alias={alias}
                        hiddenCols={hidden_cols}
                        onGridReady={this.onGridReady}
                        search={true}
                        exportBtn={true}
                        filtersBtn={true}
                        resetBtn={true}
                        editable={editableCols}
                        options={{
                          onRowValueChanged: this.rowChanged,
                          onRowEditingStarted: this.editControl,
                          getRowClass: this.rowClass,
                          enableFilter: true,
                          enableStatusBar: true,
                          alwaysShowStatusBar: false,
                          rowSelection: 'multiple',
                          editType: 'fullRow',
                          pagination,
                        }}
                        customCellRendererFramework={this.customCellRender}
                        toolPanelButtons={[
                          {
                            text: 'New Row',
                            action: this.newRow,
                            class: 'grid-reset-btn',
                          },
                          {
                            text: 'Clear Changes',
                            action: this.clearChanges,
                            class: 'grid-reset-btn',
                          },
                        ]}
                        contextMenuItems={[
                          {
                            name: 'Toggle pagination',
                            action: this.togglePagination,
                          },
                        ]}
                      />
                    )}
                  </div>
                  {/* end widget content */}
                </div>
                {/* end widget div */}
              </JarvisWidget>
            </article>
          </div>
        </WidgetGrid>

        {/* end widget grid */}
      </div>
    );
  }
}

TableConfiguration.contextTypes = {
  router: PropTypes.object.isRequired,
};

class TableButton extends React.Component {
  render() {
    return (
      <button className={this.props.class} onClick={this.props.action} disabled={this.props.disabled}>
        <i className={this.props.icon} /> {this.props.text}
      </button>
    );
  }
}
