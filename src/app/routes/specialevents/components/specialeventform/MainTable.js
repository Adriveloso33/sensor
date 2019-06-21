import React from 'react';
import PropTypes from 'prop-types';
import { JarvisWidget } from '../../../../components';

import GridTable from 'wdna-grid-table';

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      alias: null,
      hidden_cols: null,
    };
  }

  componentWillReceiveProps(nextProps, nextContex) {
    this.setState({
      ...nextProps,
    });
  }
  /**
   * Ag-Grid ready Callback
   */
  onGridReady = (params) => {
    // map the api
    this.setState({
      data: this.fixData(this.state.data),
    });
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.autoFitColumns = params.autoFitColumns;

    setTimeout(() => {
      params.columnApi.autoSizeAllColumns();
    }, 100);
  };

  fixData = (data) => {
    let fixedData = _.cloneDeep(data);
    data.forEach((row, idx) => {
      Object.keys(row).forEach((key) => {
        if (typeof row[key] != 'string' || row[key].length < 1) fixedData[idx][key] = null;
      });
    });
    console.log(fixedData);
    return fixedData;
  };

  deleteAction = (rowData) => {
    this.props.deleteRow(rowData);
  };

  editAction = (rowData) => {
    const { data } = this.state;
    console.log(data);
    const rowIndex = data.findIndex((row) => {
      return row.COL_4 == rowData.COL_4;
    });
    this.gridApi.setFocusedCell(rowIndex, 'COL_1');
    this.gridApi.startEditingCell({ rowIndex, colKey: 'COL_1' });
  };

  onRowEditingStopped = (params) => {
    let { id, data } = params.node;
    let newRow = {};
    Object.keys(data).forEach((key) => {
      if (!data[key] || data[key] == '') {
        newRow[key] = null;
      } else {
        newRow[key] = data[key];
      }
    });
    let newData = _.cloneDeep(this.state.data);
    newData[id] = newRow;
    this.setState(
      {
        data: newData,
      },
      this.context.updateParent({
        tableData: newData,
      })
    );
    this.gridApi.getRowNode(id).setData(newRow);
  };

  customCellRender = (params) => {
    const { data } = this.state;
    const valueRow = data.find((row) => {
      return row.COL_4 == params.data.COL_4;
    });
    const value = valueRow[params.colDef.field];
    return <span>{value}</span>;
  };

  render() {
    const { data, alias } = this.state;

    return (
      <JarvisWidget
        editbutton={false}
        togglebutton={false}
        fullscreenbutton={true}
        colorbutton={false}
        deletebutton={false}
        custombutton={true}
        height={'calc(50vh)'}
      >
        <header>
          <span className="widget-icon">
            <i className="fa fa-table" />
          </span>
          <h2>Event items</h2>
        </header>
        <div className="widget-body" style={{ paddingTop: '0px', width: '100%' }}>
          {data && alias && data.length > 0 ? (
            <GridTable
              key={data}
              data={data}
              alias={alias}
              onGridReady={this.onGridReady}
              onRowValueChanged={this.onRowEditingStopped}
              search={true}
              exportBtn={true}
              filtersBtn={true}
              resetBtn={false}
              editable={['COL_1', 'COL_2', 'COL_3']}
              options={{
                enableFilter: true,
                enableStatusBar: true,
                onRowEditingStopped: this.onRowEditingStopped,
                onRowValueChanged: this.onRowEditingStopped,
                alwaysShowStatusBar: false,
                rowSelection: 'multiple',
                editType: 'fullRow',
                pagination: false,
              }}
              customCellRendererFramework={this.customCellRender}
              actionButtons={[
                {
                  text: 'Edit',
                  icon: 'glyphicon glyphicon-edit',
                  action: this.editAction,
                  class: 'btn btn-info btn-xs',
                },
                {
                  text: 'Delete',
                  icon: 'glyphicon glyphicon-remove',
                  action: this.deleteAction,
                  class: 'btn btn-danger btn-xs',
                },
              ]}
            />
          ) : (
            <h2 style={{ float: 'center' }}>Add items to the table to show them</h2>
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
