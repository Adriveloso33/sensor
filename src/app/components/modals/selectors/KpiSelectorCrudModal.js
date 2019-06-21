import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import GridTable from 'wdna-grid-table';
import SortableList from '../../list/SortableList';
import ToogleItem from '../components/ToogleItem';

import Loader from '../../dashboards/components/Loader';

import { warningMessage } from '../../notifications';

const defaultGridHiddenCols = ['COL_3', 'COL_4', 'COL_5', 'COL_6', 'COL_7', 'COL_8'];
const maxSelectedElements = 10;

const maxColumns = 10;

const btnCellStyle = {
  textAlign: 'center',
};

const defaultCellStyle = {
  textAlign: 'left',
};

export default class KpiSelectorModal extends React.Component {
  constructor(props) {
    super(props);

    this.defaultHiddenCol = props.defaultHiddenCol || defaultGridHiddenCols;
    this.variableNameCol = props.colName || 'COL_2';
    this.variableIdCol = props.colId || 'COL_1';

    this.$modal = null;
    this.$el = document.getElementById('#modals-div');

    this.state = {
      loading: true,
      selectedItems: [],
      tableKey: getStr(),

      moreInfo: false,
      hiddenCols: this.defaultHiddenCol,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    $(this.$modal).on('show.bs.modal', () => {
      this.autoSizeGridColumns();
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { show } = nextProps || {};

    // handle show modal
    if (show === true) {
      this.showModal();
    } else {
      this.hideModal();
    }
  }

  /* Utils */
  showModal = (clear = false) => {
    const show = () => {
      $(this.$modal).modal({ keyboard: false, backdrop: 'static' });
    };

    const selectedItems = _.cloneDeep(this.props.selectedItems);

    this.setState(
      {
        selectedItems,
        tableKey: getStr(),
      },
      show
    );
  };

  hideModal = () => {
    $(this.$modal).modal('hide');
  };

  searchForKpiByName = (kpiName) => {
    const { items } = this.props || {};

    const kpiInfo = items.find((kpiData) => kpiData[this.variableNameCol] === kpiName);

    return kpiInfo;
  };

  searchForKpiById = (kpiId) => {
    const { items } = this.props || {};

    const kpiInfo = items.find((kpiData) => kpiData[this.variableIdCol] === kpiId);

    return kpiInfo;
  };

  /* Handlers */
  handleChanges = (event) => {
    const { target } = event || {};
    const { name, value } = target || {};

    this.setState({
      [name]: value,
    });
  };

  handleSave = (event) => {
    this.handleSaveAlternative();

    const { onSave } = this.props || {};
    const { selectedItems } = this.state || {};

    if (typeof onSave === 'function') onSave(selectedItems);
  };

  handleSaveAlternative = () => {
    const { onSaveAlternative } = this.props || {};
    const { selectedItems } = this.state || {};

    let items = [];

    selectedItems.forEach((item) => {
      const itemInfo = this.searchForKpiById(item);
      const newItem = {
        id: itemInfo[this.variableIdCol],
        name: itemInfo[this.variableNameCol],
      };
      items.push(newItem);
    });

    if (typeof onSaveAlternative === 'function') onSaveAlternative(items);
  };

  handleCancel = (event) => {
    const { onCancel } = this.props || {};

    if (typeof onCancel === 'function') onCancel();
  };

  /* Grid Helpers */
  customCellRender = (props) => {
    const { selectedItems } = this.state || {};
    const { value } = props || {};

    const { colDef } = props;
    const { field } = colDef || {};

    let childProps = {},
      ChildComponent = null;

    switch (field) {
      case this.variableIdCol:
        childProps = {
          ...props,
          onAdd: this.onAddHandler,
          onRemove: this.onRemoveHandler,
          selected: selectedItems.indexOf(value) != -1,
        };
        ChildComponent = ToogleItem;
        break;
      default:
        break;
    }

    if (!ChildComponent) return <span>{value}</span>;

    return <ChildComponent {...childProps} />;
  };

  onAddHandler = (value) => {
    const { selectedItems } = this.state || {};

    const { maxElements } = this.props;
    const max = maxElements || maxSelectedElements;

    if (selectedItems.length >= max) {
      warningMessage('Warning', 'Reached the limit of selected elements');
      this.refreshGridCells();
      return;
    }

    let newSelection = selectedItems.slice();
    newSelection.push(value);

    this.setState({
      selectedItems: newSelection,
    });
  };

  onRemoveHandler = (value) => {
    let { selectedItems } = this.state || {};

    let newSelection = selectedItems.filter((elem) => elem !== value);

    this.setState({
      selectedItems: newSelection,
    });
  };

  /* Grid ToolPanel buttons */
  resetSelection = () => {
    this.setState({
      selectedItems: [],
      tableKey: getStr(),
    });
  };

  toggleGridKpiInfo = () => {
    const { moreInfo } = this.state || {};
    const hiddenCols = !moreInfo ? [] : this.defaultHiddenCol;

    this.setState({
      moreInfo: !moreInfo,
      hiddenCols,
      tableKey: getStr(),
    });

    this.autoSizeGridColumns();
  };

  gridCellDoubleClickHandler = (params) => {
    const { data } = params || {};
    const kpiId = data[this.variableIdCol];

    const { selectedItems } = this.state || {};

    if (selectedItems.indexOf(kpiId) == -1) this.onAddHandler(kpiId);
    else this.onRemoveHandler(kpiId);

    this.refreshGridCells();
  };

  refreshGridCells = () => {
    setTimeout(() => {
      this.gridApi.redrawRows();
    }, 100);
  };

  autoSizeGridColumns = () => {
    setTimeout(() => {
      let allColumnIds = [];

      this.columnApi.getAllColumns().forEach((column) => {
        allColumnIds.push(column.colId);
      });

      this.columnApi.autoSizeColumns(allColumnIds);
    }, 500);
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    setTimeout(() => {
      this.autoSizeGridColumns();
    }, 0);
  };

  /* Sortable List functions */
  onSortableListRemove = (kpiName) => {
    const kpiInfo = this.searchForKpiByName(kpiName);
    const kpiId = kpiInfo[this.variableIdCol];

    this.onRemoveHandler(kpiId);
    this.refreshGridCells();
  };

  onChangeOrder = (selectedItemsAlias) => {
    const selectedItems = this.sortableListItemUnParse(selectedItemsAlias);

    this.setState({
      selectedItems,
    });
  };

  sortableListItemParse = (selectedItems) => {
    const { items } = this.props || {};

    const aliasList = [];
    selectedItems.forEach((itemId) => {
      const itemInfo = this.searchForKpiById(itemId);

      if (itemInfo) {
        const kpiName = itemInfo[this.variableNameCol];
        aliasList.push(kpiName);
      }
    });

    return aliasList;
  };

  sortableListItemUnParse = (selectedItemsAlias) => {
    const { items } = this.props || {};

    const idsList = [];
    selectedItemsAlias.forEach((itemName) => {
      const itemInfo = this.searchForKpiByName(itemName);

      if (itemInfo) {
        const kpiId = itemInfo[this.variableIdCol];
        idsList.push(kpiId);
      }
    });

    return idsList;
  };

  generateCellStyles = () => {
    const cellStyles = {};

    for (let i = 1; i <= maxColumns; i++) {
      const colId = `COL_${i}`;

      if (colId === 'COL_1') cellStyles[colId] = btnCellStyle;
      else cellStyles[colId] = defaultCellStyle;
    }

    return cellStyles;
  };

  modalContainer() {
    const { props } = this;
    const { items, alias, title } = props || {};
    const { hiddenCols, moreInfo, selectedItems } = this.state || {};

    alias[this.variableIdCol] = 'ACTION';

    return (
      <div
        className="modal fade selector-modal"
        ref={(el) => {
          this.$modal = el;
        }}
        role="dialog"
        aria-labelledby="settingsModalLabel"
        aria-hidden="true"
        data-backdrop="static"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleCancel}
                data-dismiss="modal"
                aria-hidden="true"
              >
                &times;
              </button>
              <h4 className="modal-title" id="mySettingsLabel">
                {title}
              </h4>
            </div>
            <div className="modal-body">
              <Loader show={props.loading} overlay={true} />
              {/* Interfaz */}
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-6 grid-container" key={this.state.tableKey}>
                  <GridTable
                    data={items}
                    alias={alias}
                    hiddenCols={hiddenCols}
                    onGridReady={this.onGridReady}
                    search={true}
                    exportBtn={false}
                    filtersBtn={false}
                    resetBtn={false}
                    customCellStyles={this.generateCellStyles()}
                    toolPanelButtons={[
                      {
                        text: moreInfo ? 'Less Info' : 'More Info',
                        class: 'grid-reset-btn',
                        action: this.toggleGridKpiInfo,
                      },
                      {
                        text: 'Reset Selection',
                        class: 'grid-reset-btn',
                        action: this.resetSelection,
                      },
                    ]}
                    customCellRendererFramework={this.customCellRender}
                    options={{
                      onCellDoubleClicked: this.gridCellDoubleClickHandler,
                      enableFilter: true,
                      enableStatusBar: true,
                      alwaysShowStatusBar: false,
                      rowSelection: 'multiple',
                      pagination: false,
                      suppressColumnVirtualisation: true,
                    }}
                  />
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 sortable-list-container">
                  <div className="sortable-list-header">
                    <h1>{`Selected ${selectedItems.length} elements`}</h1>
                  </div>
                  <SortableList
                    items={this.sortableListItemParse(selectedItems)}
                    onChangeOrder={this.onChangeOrder}
                    onRemoveElement={this.onSortableListRemove}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.handleSave}>
                Save
              </button>
              <button type="button" className="btn btn-primary" onClick={this.handleCancel} data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
          {/* /.modal-content */}
        </div>
        {/* /.modal-dialog */}
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(this.modalContainer(), this.$el);
  }
}

KpiSelectorModal.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
