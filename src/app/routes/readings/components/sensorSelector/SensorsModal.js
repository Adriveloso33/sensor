import React from 'react';
import PropTypes from 'prop-types';

import GridTable from 'wdna-grid-table';
import SweetAlert from 'sweetalert-react';

import ContainerModal from '../../../../components/modals/generics/ContainerModal';

import ToogleItem from '../dashboard/ToogleItem';

import Loader from '../../../../components/dashboards/components/Loader';

import { warningMessage } from '../../../../components/notifications/index';

const maxSelectedElements = 10;
const minSelectedElements = 0;

const maxColumns = 10;

const btnCellStyle = {
  textAlign: 'center',
};

const defaultCellStyle = {
  textAlign: 'left',
};

const minimunFilterValidLen = 3; // provide 3 chars at least for filter selection

export default class SensorsModal extends React.Component {
  static contextTypes = {};

  static defaultProps = {
    data: {},
    title: 'Sensor Selector',
    show: false,
    showConfiguration: false,
    onSave: null,
    onCancel: null,
    onConfigSave: null,
  };

  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    show: PropTypes.bool,
    showConfiguration: PropTypes.bool,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onConfigSave: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.modalRef = null;

    // generate some randoms ids for the tabs
    this.tabsIds = [];
    for (let i = 0; i < 2; i++) this.tabsIds[i] = getStr();

    this.ULId = getStr();

    this.selectionWasChanged = false;

    this.state = {
      selectedItems: [],
      tableKey: getStr(),

      showMoreInfo: false,
      showConfirmationAlert: false,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    $(this.modalRef).on('show.bs.modal', () => {
      this.autoSizeGridColumns();
    });
  }

  componentWillReceiveProps(nextProps) {
    const { show } = nextProps || {};

    if (show === true && this.props.show === false) {
      this.setUpModalData();
    }
  }

  /* Utils */
  assignModalRef = (ref) => {
    this.modalRef = ref.current;
  };

  setUpModalData = () => {
    const selectedItems = _.cloneDeep(this.props.selectedItems);
    this.selectionWasChanged = false;

    this.setState({
      selectedItems,
      showMoreInfo: false,
      tableKey: getStr(),
    });
  };

  searchForKpiByName = (kpiName) => {
    const { colName } = this.props.data || {};

    return this.searchForKpiByColumn(kpiName, colName);
  };

  searchForSensorById = (sensorId) => {
    const { Id } = this.props.data[0] || {};
    return this.searchForKpiByColumn(sensorId, Id);
  };

  searchForKpiByColumn = (sensor, Id) => {
    const { data } = this.props;
    const items = data;
    if (!items) return null;

    return items.find((sensorData) => sensorData[Id] === sensor);
  };

  /* Handlers */
  handleChanges = (event) => {
    const { target } = event || {};
    const { name, value } = target || {};

    this.setState({
      [name]: value,
    });
  };

  handleSave = () => {
    const { selectedItems } = this.state;
    const { rowData } = this.state;
    const { onSave } = this.props;
    const totalElements = selectedItems.length;

    if (!this.isValidMinElements(totalElements)) return;

    const sensorData = {
      id: rowData.Id,
      sensor: rowData.Sensor,
      name: rowData.Name,
    };

    if (typeof onSave === 'function') onSave(sensorData);
  };

  handleCancel = () => {
    if (this.selectionWasChanged) {
      this.showConfirmationAlert();
    } else {
      this.executeCancelCb();
    }
  };

  executeCancelCb = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') onCancel();
  };

  hideConfirmationAlert = (cb) => {
    this.setState(
      {
        showConfirmationAlert: false,
      },
      cb
    );
  };

  showConfirmationAlert = (cb) => {
    this.setState(
      {
        showConfirmationAlert: true,
      },
      cb
    );
  };

  isValidMaxElements = (lengthElements) => {
    const { maxElements } = this.props;
    const max = maxElements || maxSelectedElements;

    if (lengthElements > max) {
      warningMessage('Warning', `Reached the limit of selected elements (${max})`);
      this.refreshGridCells();
      return false;
    }

    return true;
  };

  isValidMinElements = (lengthElements) => {
    const { minElements } = this.props;
    const min = minElements || minSelectedElements;

    if (lengthElements < min) {
      warningMessage('Warning', `Select at least ${min} elements`);
      this.refreshGridCells();
      return false;
    }

    return true;
  };

  handleFormTextSave = (values) => {
    const newSelection = values ? values.slice() : [];
    const totalElements = newSelection.length;

    if (!this.isValidMaxElements(totalElements)) return;

    this.selectionWasChanged = true;

    const selectedItems = this.sortableListItemUnParse(newSelection);

    this.setState(
      {
        selectedItems,
      },
      this.refreshGridCells
    );
  };

  /* Grid Helpers */
  customCellRender = (props) => {
    const { selectedItems } = this.state;
    const { colDef, value } = props;
    const { field } = colDef;

    if (field !== 'Action') return <span>{value}</span>;

    const sensorId = this.getSensorId(props.rowIndex);
    const childProps = {
      ...props,
      value: sensorId,
      onAdd: this.onAddHandler,
      onRemove: this.onRemoveHandler,
    };

    return <ToogleItem {...childProps} />;
  };

  getSensorId = (rowIndex) => {
    const { data } = this.props;

    return data[rowIndex].Id;
  };

  onAddHandler = (value) => {
    const { selectedItems } = this.state;

    const totalElements = selectedItems.length + 1; // is not yet added
    if (!this.isValidMaxElements(totalElements)) return;

    this.selectionWasChanged = true;
    const newSelection = Object.entries(selectedItems).slice();
    newSelection.push(value);

    const rowData = this.getDataRowById(value);

    this.setState({
      selectedItems: newSelection,
      rowData,
    });
  };

  getDataRowById = (Id) => {
    const { data } = this.props;

    let rowOutput = {};

    data.forEach((row) => {
      if (Id === row.Id) {
        rowOutput = row;
      }
    });

    return rowOutput;
  };

  onRemoveHandler = (value) => {
    const { selectedItems } = this.state;

    const newSelection = selectedItems.filter((elem) => elem !== value);

    this.selectionWasChanged = true;

    this.setState({
      selectedItems: newSelection,
      rowData: [],
    });
  };

  /* Grid ToolPanel buttons */
  resetSelection = () => {
    this.selectionWasChanged = true;

    this.setState({
      selectedItems: [],
      tableKey: getStr(),
    });
  };

  toggleGridKpiInfo = () => {
    const { showMoreInfo } = this.state;

    this.setState({
      showMoreInfo: !showMoreInfo,
      tableKey: getStr(),
    });

    this.autoSizeGridColumns();
  };

  gridCellDoubleClickHandler = (params) => {
    // this.onAddHandler();
    // this.handleSave();
    return null;
  };

  toggleShowSelection = () => {
    const { selectedItems } = this.state;
    if (selectedItems.length === 0) {
      warningMessage('Warning', 'Select at least one item');
      return;
    }

    this.setState(
      (prevState) => ({
        showOnlySelected: !prevState.showOnlySelected,
      }),
      this.updateFilterStatus
    );
  };

  updateFilterStatus = () => {
    const { showOnlySelected } = this.state;

    if (!showOnlySelected) this.clearFilter();
    else {
      const { selectedItems } = this.state;
      this.setFilterValues(selectedItems);
    }
  };

  clearFilter = () => {
    const { colId } = this.props.data;
    const columnFilterComponent = this.gridApi.getFilterInstance(colId);
    columnFilterComponent.selectEverything();
    this.gridApi.onFilterChanged();
  };

  setFilterValues = (values) => {
    const columnFilterComponent = this.gridApi.getFilterInstance(values[0]);
    columnFilterComponent.selectNothing();
    for (let i = 0; i < values.length; i++) {
      columnFilterComponent.selectValue(values[i]);
    }

    this.gridApi.onFilterChanged();
  };

  selectAllAfterFilter = () => {
    const selection = Object.entries(this.state.selectedItems).slice();

    const areGridFiltersValids = this.areFlotatingFiltersValids() || this.isQuickFilterValid();

    if (!areGridFiltersValids) {
      warningMessage('Warning', 'Please filter the results first');
      return;
    }

    const { colId } = this.props.data;
    this.gridApi.forEachNodeAfterFilter((rowNode) => {
      const { data = {} } = rowNode;
      const itemId = data[colId];

      if (selection.includes(itemId)) return null;

      selection.push(itemId);
    });

    this.selectionWasChanged = true;

    this.setState(
      {
        selectedItems: selection,
      },
      this.refreshGridCells
    );
  };

  isQuickFilterValid = () => {
    if (!this.gridApi.isQuickFilterPresent()) return false;

    let quickFilterValue = '';

    // undocumented grid api option, thats is the reason of try-catch block
    try {
      quickFilterValue = this.gridApi.filterManager.quickFilter;
    } catch (ex) {
      return false;
    }

    return quickFilterValue.length >= minimunFilterValidLen;
  };

  areFlotatingFiltersValids = () => {
    const filters = this.gridApi.getFilterModel();
    let isValidFilter = false;

    Object.keys(filters).forEach((key) => {
      const filter = filters[key];
      const text = filter.filter;

      if (text.length >= minimunFilterValidLen) isValidFilter = true;
    });

    return isValidFilter;
  };

  refreshGridCells = () => {
    setTimeout(() => {
      this.gridApi.redrawRows();
    }, 100);
  };

  autoSizeGridColumns = () => {
    setTimeout(() => {
      const allColumnIds = [];

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

    const { colId } = this.props.data || {};
    const kpiId = kpiInfo[colId];
    this.selectionWasChanged = true;

    this.onRemoveHandler(kpiId);
    this.refreshGridCells();
  };

  onChangeOrder = (selectedItemsAlias) => {
    const selectedItems = this.sortableListItemUnParse(selectedItemsAlias);
    this.selectionWasChanged = true;

    this.setState(
      {
        selectedItems,
      },
      this.refreshGridCells
    );
  };

  sortableListItemParse = (selectedItems) => {
    const { colName } = this.props.data || {};
    const aliasList = [];

    selectedItems.forEach((itemId) => {
      const itemInfo = this.searchForSensorById(itemId);

      if (itemInfo) {
        const kpiName = itemInfo[colName];
        aliasList.push(kpiName);
      }
    });

    return aliasList;
  };

  sortableListItemUnParse = (selectedItemsAlias) => {
    const { colId } = this.props.data || {};
    const idsList = [];
    selectedItemsAlias.forEach((itemName) => {
      const itemInfo = this.searchForKpiByName(itemName);

      if (itemInfo) {
        const kpiId = itemInfo[colId];
        idsList.push(kpiId);
      }
    });

    return idsList;
  };

  generateCellStyles = () => {
    const cellStyles = {};
    const { colId } = this.props.data;

    for (let i = 1; i <= maxColumns; i++) {
      const id = `COL_${i}`;

      if (id === colId) cellStyles[id] = btnCellStyle;
      else cellStyles[id] = defaultCellStyle;
    }

    return cellStyles;
  };

  generateColumnFilters = () => {
    const filters = {};

    const { data } = this.props;
    if (!data || !data.data) return filters;

    const items = data.data;

    if (!items || !items[0]) return filters;

    const firstRow = items[0];
    Object.keys(firstRow).forEach((key) => {
      filters[key] = 'agTextColumnFilter';
    });

    const { colId } = data;
    filters[colId] = 'agSetColumnFilter';
    return filters;
  };

  exportKpisConfig = (config) => {
    const { onConfigSave } = this.props;

    if (typeof onConfigSave === 'function') {
      onConfigSave(config);
    }
  };

  removeListColumn = (colId, list = []) => {
    return list.slice().filter((item) => item !== colId);
  };

  gridContainer = () => {
    const { props, tabsIds } = this;
    const { col2alias, colId, hiddenLessInfo, hiddenMoreInfo } = props.data || {};
    const { showConfiguration } = props;
    const { showMoreInfo } = this.state;

    const tab1Id = `tab_${tabsIds[0]}`;

    let hiddenColumns = showMoreInfo ? hiddenMoreInfo : hiddenLessInfo;
    hiddenColumns = this.removeListColumn(colId, hiddenColumns);

    if (col2alias && colId) col2alias[colId] = 'ACTION';

    const normalGridClass = 'col-sm-12 col-md-7 col-lg-7 grid-container';
    const fullWidthGridClass = 'col-sm-12 col-md-12 col-lg-12 grid-container';

    return (
      <div className={showConfiguration ? normalGridClass : fullWidthGridClass}>
        <div className="tabs-left">
          <div className="tab-content">
            <div className="tab-pane active" id={tab1Id}>
              <div key={this.state.tableKey} className="grid-container">
                <GridTable
                  search
                  exportBtn
                  filtersBtn
                  data={this.props.data || []}
                  alias={col2alias}
                  hiddenCols={hiddenColumns}
                  onGridReady={this.onGridReady}
                  resetBtn={false}
                  customCellStyles={this.generateCellStyles()}
                  filterTypes={this.generateColumnFilters()}
                  toolPanelButtons={[
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
                    rowSelection: 'single',
                    pagination: false,
                    suppressColumnVirtualisation: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  generateModalBody = () => {
    const { loading, showConfiguration } = this.props;

    return (
      <div>
        <Loader overlay show={loading} />
        {/* Interfaz */}
        <div className="row">
          {this.gridContainer()}
          {showConfiguration && this.sortableListContainer()}
        </div>
      </div>
    );
  };

  genericModalContainer = (content) => (
    <ContainerModal
      fullScreenButton
      show={this.props.show}
      title={this.props.title}
      modalClass="modal-lg selector-modal with-configuration"
      onClose={this.handleCancel}
      exportRef={this.assignModalRef}
      headerButtons={[
        {
          text: 'Save',
          className: 'btn btn-primary',
          onClick: this.handleSave,
        },
      ]}
    >
      {content}
    </ContainerModal>
  );

  confirmAlertContainer = () => (
    <SweetAlert
      showCancelButton
      show={this.state.showConfirmationAlert}
      title="Confirm"
      text="Are you sure you want to close? Changes will be lost."
      onConfirm={() => {
        this.hideConfirmationAlert(this.executeCancelCb);
      }}
      onCancel={() => {
        this.hideConfirmationAlert();
      }}
    />
  );

  render() {
    const bodyContent = this.generateModalBody();
    return [this.genericModalContainer(bodyContent), this.confirmAlertContainer()];
  }
}
