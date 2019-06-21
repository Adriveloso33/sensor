import React from 'react';
import PropTypes from 'prop-types';

import GridTable from 'wdna-grid-table';

import { JarvisWidget } from '../../../../components';

import Loader from '../../../../components/dashboards/components/Loader';
import ToogleItem from './ToogleItem';

export default class MainTable extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.$modal = null;

    this.state = {
      selectedItems: [],
      threshold: {},
      alias: {},
      pagination: true,
    };
  }

  onGridReady = (params) => {
    // map the api
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.autoFitColumns = params.autoFitColumns;
  };

  customCellRender = (props) => {
    const { selectedItems } = this.state;
    const { value, colDef } = props;
    const { field } = colDef;

    let childProps = {};
    let ChildComponent = null;

    switch (field) {
      case 'Action':
        if (this.props.toogleItem) {
          childProps = {
            ...props,
            onAdd: this.onAddHandler,
            onRemove: this.onRemoveHandler,
            selected: selectedItems.indexOf(value) !== -1,
          };
          ChildComponent = ToogleItem;
        }
        break;
      default:
        break;
    }

    if (!ChildComponent) return <span>{value}</span>;

    return <ChildComponent {...childProps} />;
  };

  render() {
    const { alias, threshold, pagination } = this.state;
    const { props } = this;
    const { data } = props;

    return (
      <JarvisWidget
        editbutton={false}
        togglebutton={false}
        fullscreenbutton
        colorbutton={false}
        deletebutton={false}
        custombutton
        height="calc(80vh)"
      >
        <header style={{ float: 'right' }}>
          <i className="widget-icon" />
        </header>
        <div className="widget-body" style={{ paddingTop: '0px' }}>
          <Loader show={this.props.loading} overlay={false} />
          {data && alias && threshold && (
            <GridTable
              data={data}
              alias={alias}
              onGridReady={this.onGridReady}
              search
              exportBtn
              filtersBtn
              resetBtn
              toolPanelButtons={this.props.toolPanelButtons}
              options={{
                enableFilter: true,
                enableStatusBar: true,
                alwaysShowStatusBar: false,
                rowSelection: 'multiple',
                pagination,
                paginationAutoPageSize: true,
              }}
              actionTitle="Actions"
              actionButtons={this.props.actionButtons}
              customCellRendererFramework={this.customCellRender}
              contextMenuItems={[
                {
                  name: 'Toggle pagination',
                  action: this.togglePagination,
                },
                {
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
              columnsMinWidth={{
                id: 50,
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
