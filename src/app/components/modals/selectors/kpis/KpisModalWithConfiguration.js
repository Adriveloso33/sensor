import React from 'react';
import PropTypes from 'prop-types';

import GridTable from 'wdna-grid-table';
import SweetAlert from 'sweetalert-react';

import ContainerModal from '../../generics/ContainerModal';

import TextItemsSelector from '../../components/TextItemsSelector';
import SortableList from '../../../list/SortableList';
import ToogleItem from '../../components/ToogleItem';
import SerieInlineConfiguration from '../../components/SerieInlineConfiguration';

import Loader from '../../../dashboards/components/Loader';

import WdnaColors from '../../../../helpers/HighChartColors';

import { warningMessage } from '../../../notifications';

const maxSelectedElements = 10;
const minSelectedElements = 0;

const maxColumns = 10;
const maxItemsForList = 50;

const btnCellStyle = {
  textAlign: 'center',
};

const defaultCellStyle = {
  textAlign: 'left',
};

const colorsLimit = WdnaColors.length;
const defaultSerieConfig = {
  yAxis: 0,
  color: '#008aad',
  type: 'spline',
};

const minimunFilterValidLen = 3; // provide 3 chars at least for filter selection

export default class KpisModalWithConfiguration extends React.Component {
  static contextTypes = {};

  static defaultProps = {
    data: {},
    selectedItems: [],
    title: 'KPI Selector',
    show: false,
    showConfiguration: true,
    kpisConfig: {},
    onSave: null,
    onCancel: null,
    onConfigSave: null,
  };

  static propTypes = {
    data: PropTypes.object,
    selectedItems: PropTypes.object,
    title: PropTypes.string,
    show: PropTypes.bool,
    showConfiguration: PropTypes.bool,
    kpisConfig: PropTypes.object,
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

    this.kpisConfig = {};
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

  componentDidUpdate() {
    const { selectedItems = [] } = this.state;
    const { kpisConfig } = this;

    selectedItems.forEach((kpiId, index) => {
      if (!kpisConfig[kpiId]) {
        kpisConfig[kpiId] = {
          ...defaultSerieConfig,
          color: WdnaColors[index % colorsLimit],
        };
      }
    });
  }

  /* Utils */
  assignModalRef = (ref) => {
    this.modalRef = ref.current;
  };

  setUpModalData = () => {
    const selectedItems = _.cloneDeep(this.props.selectedItems);
    this.kpisConfig = _.cloneDeep(this.props.kpisConfig);
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

  searchForKpiById = (kpiId) => {
    const { colId } = this.props.data || {};

    return this.searchForKpiByColumn(kpiId, colId);
  };

  searchForKpiByColumn = (kpi, columnId) => {
    const { data } = this.props;

    const items = data.data;
    if (!items) return null;

    return items.find((kpiData) => kpiData[columnId] === kpi);
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
    this.handleSaveAlternative();

    const { kpisConfig } = this;
    this.exportKpisConfig(kpisConfig);

    const { onSave } = this.props;
    const { selectedItems } = this.state;
    const totalElements = selectedItems.length;

    if (!this.isValidMinElements(totalElements)) return;

    if (typeof onSave === 'function') onSave(selectedItems);
  };

  handleSaveAlternative = () => {
    const { onSaveAlternative } = this.props;
    const { selectedItems } = this.state;
    const { colId } = this.props.data || {};
    const { colName } = this.props.data || {};

    const items = [];

    selectedItems.forEach((item) => {
      const itemInfo = this.searchForKpiById(item);
      const newItem = {
        id: itemInfo[colId],
        name: itemInfo[colName],
      };
      items.push(newItem);
    });

    if (typeof onSaveAlternative === 'function') onSaveAlternative(items);
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
    const { colId } = this.props.data || {};
    const { selectedItems } = this.state;
    const { value, colDef } = props;
    const { field } = colDef;

    let childProps = {};
    let ChildComponent = null;

    switch (field) {
      case colId:
        childProps = {
          ...props,
          onAdd: this.onAddHandler,
          onRemove: this.onRemoveHandler,
          selected: selectedItems.indexOf(value) !== -1,
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
    const { selectedItems } = this.state;

    const totalElements = selectedItems.length + 1; // is not yet added

    if (!this.isValidMaxElements(totalElements)) return;

    this.selectionWasChanged = true;

    const newSelection = selectedItems.slice();
    newSelection.push(value);

    this.setState({
      selectedItems: newSelection,
    });
  };

  onRemoveHandler = (value) => {
    const { selectedItems } = this.state;

    const newSelection = selectedItems.filter((elem) => elem !== value);

    this.selectionWasChanged = true;

    this.setState({
      selectedItems: newSelection,
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
    const { data } = params;
    const { colId } = this.props.data || {};
    const kpiId = data[colId];

    const { selectedItems } = this.state;

    if (selectedItems.indexOf(kpiId) === -1) this.onAddHandler(kpiId);
    else this.onRemoveHandler(kpiId);

    this.refreshGridCells();
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
    const { colId } = this.props.data;
    const columnFilterComponent = this.gridApi.getFilterInstance(colId);

    columnFilterComponent.selectNothing();
    for (let i = 0; i < values.length; i++) {
      columnFilterComponent.selectValue(values[i]);
    }

    this.gridApi.onFilterChanged();
  };

  selectAllAfterFilter = () => {
    const selection = this.state.selectedItems.slice();

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
      const itemInfo = this.searchForKpiById(itemId);

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

  inlineConfigHandler = (itemId, itemConfig) => {
    this.selectionWasChanged = true;

    this.kpisConfig[itemId] = itemConfig;
    this.exportKpisConfig(this.kpisConfig);
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
    const { props, tabsIds, ULId } = this;
    const { data, col2alias, colId, hiddenLessInfo, hiddenMoreInfo } = props.data || {};
    const { showConfiguration } = props;
    const { showMoreInfo, selectedItems } = this.state;

    const tab1Id = `tab_${tabsIds[0]}`;
    const tab2Id = `tab_${tabsIds[1]}`;

    let hiddenColumns = showMoreInfo ? hiddenMoreInfo : hiddenLessInfo;
    hiddenColumns = this.removeListColumn(colId, hiddenColumns);

    if (col2alias && colId) col2alias[colId] = 'ACTION';

    const normalGridClass = 'col-sm-12 col-md-7 col-lg-7 grid-container';
    const fullWidthGridClass = 'col-sm-12 col-md-12 col-lg-12 grid-container';

    return (
      <div className={showConfiguration ? normalGridClass : fullWidthGridClass}>
        <div className="tabs-left">
          <ul className="nav nav-tabs tabs-left" id={ULId}>
            <li className="active">
              <a href={`#${tab1Id}`} data-toggle="tab">
                From List
              </a>
            </li>
            <li>
              <a href={`#${tab2Id}`} data-toggle="tab">
                From Text
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active" id={tab1Id}>
              <div key={this.state.tableKey} className="grid-container">
                <GridTable
                  search
                  exportBtn
                  filtersBtn
                  data={data || []}
                  alias={col2alias}
                  hiddenCols={hiddenColumns}
                  onGridReady={this.onGridReady}
                  resetBtn={false}
                  customCellStyles={this.generateCellStyles()}
                  filterTypes={this.generateColumnFilters()}
                  toolPanelButtons={[
                    {
                      text: 'Show Selection',
                      class: 'grid-reset-btn',
                      action: this.toggleShowSelection,
                    },
                    {
                      text: 'Select Filter',
                      class: 'grid-reset-btn',
                      action: this.selectAllAfterFilter,
                    },
                    {
                      text: showMoreInfo ? 'Less Info' : 'More Info',
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
            </div>

            <div className="tab-pane grid-container" id={tab2Id}>
              <TextItemsSelector values={this.sortableListItemParse(selectedItems)} onSave={this.handleFormTextSave} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  sortableListContainer = () => {
    const { props, kpisConfig } = this;
    const { selectedItems } = this.state;

    return (
      <div className="col-sm-12 col-md-5 col-lg-5 sortable-list-container">
        <div className="sortable-list-header">
          <h1>{`${selectedItems.length} KPIs SELECTED`}</h1>
        </div>
        <table className="kpi-config-headers">
          <tr>
            <th className="kpi-config-kpi">KPI</th>
            <th className="kpi-config-axis">Axis</th>
            <th className="kpi-config-color">Color</th>
            <th className="kpi-config-graph">Graph</th>
          </tr>
        </table>
        {selectedItems.length <= maxItemsForList && (
          <SortableList
            removeButton
            items={this.sortableListItemParse(selectedItems)}
            onChangeOrder={this.onChangeOrder}
            onRemoveElement={this.onSortableListRemove}
            inlineContent={(inlineProps) => (
              <SerieInlineConfiguration {...props} {...inlineProps} onInlineConfigChange={this.inlineConfigHandler} />
            )}
            itemsConfig={kpisConfig}
            itemsIds={selectedItems}
          />
        )}
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
