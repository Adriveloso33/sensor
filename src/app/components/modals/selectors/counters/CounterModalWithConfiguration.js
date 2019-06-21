import React from 'react';
import PropTypes from 'prop-types';

import GridTable from 'wdna-grid-table';
import SweetAlert from 'sweetalert-react';

import ContainerModal from '../../generics/ContainerModal';

import TextItemsSelector from '../../components/TextItemsSelector';

import SortableList from '../../../list/SortableList';
import ToogleItem from '../../components/ToogleItem';
import AggregationSelect from '../../components/AggregationSelect';
import SerieInlineConfiguration from '../../components/SerieInlineConfiguration';

import Loader from '../../../dashboards/components/Loader';

import WdnaColors from '../../../../helpers/HighChartColors';

import { validateAggregationExpression } from '../../../../helpers/GlobalHelper';

import { warningMessage, errorMessage } from '../../../notifications';

const maxSelectedElements = 10;

const customAggregationLevels =
  'SUM, MAX, MIN, AVG, EXP, POW, SIN, TAN, COS, PI, RADIANS, SQRT, LOG, LOG10, LOG2, LN, DEGREES, COUNT, ROUND, FORMAT, COALESCE, IFNULL, IF';

const customAggregationSigns = '+, -, *, /, <, >';
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

export default class CounterModalWithConfiguration extends React.Component {
  static contextTypes = {
    parentState: PropTypes.object.isRequired,
    updateParent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    selectedItems: [],
    title: 'Counter Selector',
    show: false,
    showConfiguration: true,
    countersConfig: {},
    onSave: null,
    onCancel: null,
    onConfigSave: null,
  };

  static propTypes = {
    data: PropTypes.object.isRequired,
    selectedItems: PropTypes.array,
    title: PropTypes.string,
    show: PropTypes.bool,
    showConfiguration: PropTypes.bool,
    countersConfig: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onConfigSave: PropTypes.func,
  };

  constructor(props) {
    super(props);

    // generate some randoms ids for the tabs
    this.tabsIds = [];
    for (let i = 0; i < 2; i++) this.tabsIds[i] = getStr();

    this.modalRef = null;

    this.ULId = getStr();
    this.countersConfig = {};

    this.selectionWasChanged = false;

    this.state = {
      selectedItems: [],
      customCountersAggregation: {},

      tableKey: getStr(),

      showMoreInfo: false,

      // custom aggregation sweetalert
      showCustomAggregationInput: false,
      customAggregationInputId: null,
      customAggregationInputValue: null,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    $(this.modalRef).on('show.bs.modal', () => {
      this.autoSizeGridColumns();
    });
  }

  componentWillReceiveProps(nextProps) {
    const { show } = nextProps;

    if (show === true && this.props.show === false) {
      this.setUpModalData();
    }
  }

  componentDidUpdate() {
    const { selectedItems = [] } = this.state;
    const { countersConfig } = this;

    selectedItems.forEach((counterId, index) => {
      if (!countersConfig[counterId]) {
        countersConfig[counterId] = {
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
    const customCountersAggregation = _.cloneDeep(this.props.customCountersAggregation || {});
    this.countersConfig = _.cloneDeep(this.props.countersConfig);

    this.selectionWasChanged = false;

    this.setState({
      selectedItems,
      customCountersAggregation,
      tableKey: getStr(),
    });
  };

  searchForItemByName = (itemName) => {
    const { colName } = this.props.data || {};

    return this.searchForItemByColumn(itemName, colName);
  };

  searchForItemById = (itemId) => {
    const { colId } = this.props.data || {};

    return this.searchForItemByColumn(itemId, colId);
  };

  searchForItemByColumn = (item, columnId) => {
    const { data } = this.props;

    const items = data.data;
    if (!items) return null;

    return items.find((row) => row[columnId] === item);
  };

  /* General Handlers */
  handleSave = () => {
    this.handleSaveAlternative();

    const { countersConfig } = this;
    this.exportCountersConfig(countersConfig);

    const { onSave } = this.props;
    const { selectedItems, customCountersAggregation } = this.state;

    if (typeof onSave === 'function') onSave(selectedItems, customCountersAggregation);
  };

  handleFormTextSave = (values) => {
    const newSelection = values ? values.slice() : [];

    const { maxElements } = this.props;
    const max = maxElements || maxSelectedElements;

    if (newSelection.length >= max) {
      warningMessage('Warning', 'Reached the limit of selected elements');
      this.refreshGridCells();
      return null;
    }

    this.selectionWasChanged = true;

    const selectedItems = this.sortableListItemUnParse(newSelection);

    this.setState(
      {
        selectedItems,
      },
      this.refreshGridCells
    );
  };

  handleSaveAlternative = () => {
    const { onSaveAlternative } = this.props;
    const { selectedItems, customCountersAggregation } = this.state;
    const { colId } = this.props.data || {};
    const { colName } = this.props.data || {};

    const items = [];
    selectedItems.forEach((item) => {
      const itemInfo = this.searchForItemById(item);

      const newItem = {
        id: itemInfo[colId],
        name: itemInfo[colName],
      };
      items.push(newItem);
    });

    if (typeof onSaveAlternative === 'function') onSaveAlternative(items, customCountersAggregation);
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

  /* SweetAlert Handlers */
  handleShowCustomAggregationInput = (show = false) => {
    this.setState({
      showCustomAggregationInput: show,
    });

    this.refreshGridCells();
  };

  handleConfirmCustomAggregationInput = (value) => {
    if (!value || !this.isAggregationValueValid(value)) {
      errorMessage('Error', 'The aggregation value or expression is not valid.');
      return;
    }

    // process new aggregation value
    const { customCountersAggregation, customAggregationInputId } = this.state;
    const currentCountersAgg = _.cloneDeep(customCountersAggregation);

    currentCountersAgg[customAggregationInputId] = value.toUpperCase();

    this.selectionWasChanged = true;

    this.setState({
      customCountersAggregation: currentCountersAgg,
    });

    this.handleShowCustomAggregationInput(false);

    this.refreshGridCells();
  };

  isAggregationValueValid = (value) => {
    const isValid = validateAggregationExpression(value, customAggregationLevels, customAggregationSigns);

    return isValid;
  };

  getCounterAggregation = (counterId) => {
    const firstCommaOcurrence = counterId.indexOf(',');

    if (!firstCommaOcurrence) return '';

    const aggLevel = counterId.substring(2, firstCommaOcurrence);
    return aggLevel;
  };

  handleCancelCustomAggregationInput = () => {
    this.handleShowCustomAggregationInput(false);
  };

  /* Grid Helpers */
  customCellRender = (props) => {
    const { colId, aggregationColumn } = this.props.data || {};

    const { selectedItems, customCountersAggregation = {} } = this.state;

    const { value, data, colDef } = props;
    const counterId = data[colId];

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

      case aggregationColumn:
        childProps = {
          ...props,
          id: counterId,
          value: customCountersAggregation[counterId] || this.getCounterAggregation(counterId),
          onSelect: this.onSelectAggregationHandler,
        };
        ChildComponent = AggregationSelect;
        break;

      default:
        break;
    }

    if (!ChildComponent) return <span>{value}</span>;

    return <ChildComponent {...childProps} />;
  };

  /* Add/Remove Handler */
  onAddHandler = (value) => {
    const { selectedItems } = this.state;

    const { maxElements } = this.props;
    const max = maxElements || maxSelectedElements;

    if (selectedItems.length >= max) {
      warningMessage('Warning', 'Reached the limit of selected elements');
      this.refreshGridCells();
      return;
    }

    this.selectionWasChanged = true;

    const newSelection = selectedItems.slice();
    newSelection.push(value);

    this.setState(
      {
        selectedItems: newSelection,
      },
      this.refreshGridCells
    );
  };

  onRemoveHandler = (value) => {
    const { selectedItems } = this.state;

    const newSelection = selectedItems.filter((elem) => elem !== value);

    this.selectionWasChanged = true;

    this.setState(
      {
        selectedItems: newSelection,
      },
      this.refreshGridCells
    );
  };

  /* Aggregation support handlers */
  onSelectAggregationHandler = (id, value) => {
    const { customCountersAggregation } = this.state;

    if (value === 'CUSTOM') {
      const currentCounterAggregation = customCountersAggregation[id];

      this.setState({
        showCustomAggregationInput: true,
        customAggregationInputId: id,
        customAggregationInputValue: currentCounterAggregation,
      });

      return null;
    }

    this.selectionWasChanged = true;

    const currentCountersAgg = _.cloneDeep(customCountersAggregation);

    currentCountersAgg[id] = value;

    this.setState({
      customCountersAggregation: currentCountersAgg,
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
  };

  gridCellDoubleClickHandler = (params) => {
    const { data } = params;
    const { colId } = this.props.data || {};

    const itemId = data[colId];

    const { selectedItems } = this.state;

    if (selectedItems.indexOf(itemId) === -1) this.onAddHandler(itemId);
    else this.onRemoveHandler(itemId);

    this.refreshGridCells();
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    this.autoSizeGridColumns();
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
    const { colId } = this.props.data || {};

    const columnFilterComponent = this.gridApi.getFilterInstance(colId);
    columnFilterComponent.selectEverything();
    this.gridApi.onFilterChanged();
  };

  setFilterValues = (values) => {
    const { colId } = this.props.data || {};
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

    const { colId } = this.props.data || {};
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

    // undocumented grid api option, that is the reason of try-catch block
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

  /* Sortable List functions */
  onSortableListRemove = (itemName) => {
    const itemInfo = this.searchForItemByName(itemName);

    const { colId } = this.props.data || {};
    const itemId = itemInfo[colId];

    this.onRemoveHandler(itemId);
    this.refreshGridCells();
  };

  onChangeOrder = (selectedItemsAlias) => {
    const selectedItems = this.sortableListItemUnParse(selectedItemsAlias);

    this.setState({
      selectedItems,
    });
  };

  sortableListItemParse = (selectedItems) => {
    const aliasList = [];
    selectedItems.forEach((itemId) => {
      const itemInfo = this.searchForItemById(itemId);

      if (itemInfo) {
        const { colName } = this.props.data || {};
        const itemName = itemInfo[colName];
        aliasList.push(itemName);
      }
    });

    return aliasList;
  };

  sortableListItemUnParse = (selectedItemsAlias) => {
    const idsList = [];
    selectedItemsAlias.forEach((itemName) => {
      const itemInfo = this.searchForItemByName(itemName);

      if (itemInfo) {
        const { colId } = this.props.data || {};
        const itemId = itemInfo[colId];
        idsList.push(itemId);
      }
    });

    return idsList;
  };

  generateCellStyles = () => {
    const cellStyles = {};
    const { colId } = this.props.data || {};

    for (let i = 1; i <= maxColumns; i++) {
      const id = `COL_${i}`;

      if (id === colId) cellStyles[id] = btnCellStyle;
      else cellStyles[id] = defaultCellStyle;
    }

    return cellStyles;
  };

  inlineConfigHandler = (itemId, itemConfig) => {
    this.selectionWasChanged = true;

    this.countersConfig[itemId] = itemConfig;
    this.exportCountersConfig(this.countersConfig);
  };

  exportCountersConfig = (config) => {
    const { onConfigSave } = this.props;

    if (typeof onConfigSave === 'function') {
      onConfigSave(config);
    }
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

    const { colId, aggregationColumn } = this.props.data;
    filters[colId] = 'agSetColumnFilter';
    filters[aggregationColumn] = 'agSetColumnFilter';

    return filters;
  };

  removeListColumn = (colId, list = []) => {
    return list.slice().filter((item) => item !== colId);
  };

  gridContainer = () => {
    const { props, tabsIds } = this;
    const { data, col2alias, colId, hiddenLessInfo, hiddenMoreInfo } = props.data || {};
    const { showConfiguration } = props;
    const { showMoreInfo, selectedItems } = this.state;

    const tab1Id = `tab_${tabsIds[0]}`;
    const tab2Id = `tab_${tabsIds[1]}`;

    let hiddenColumns = showMoreInfo ? hiddenMoreInfo : hiddenLessInfo;
    hiddenColumns = this.removeListColumn(colId, hiddenColumns);

    if (col2alias && colId) col2alias[colId] = 'ACTION';

    const normalGridClass = 'col-sm-12 col-md-6 col-lg-7';
    const fullWidthGridClass = 'col-sm-12 col-md-12 col-lg-12';

    return (
      <div className={showConfiguration ? normalGridClass : fullWidthGridClass}>
        <div className="tabs-left">
          <ul className="nav nav-tabs tabs-left" id={this.ULId}>
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
                  customCellStyles={this.generateCellStyles()}
                  filterTypes={this.generateColumnFilters()}
                  resetBtn={false}
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
    const { countersConfig, props } = this;
    const { selectedItems } = this.state;

    return (
      <div className="col-sm-12 col-md-5 col-lg-5 sortable-list-container">
        <div className="sortable-list-header">
          <h1>{`Selected ${selectedItems.length} elements`}</h1>
        </div>
        {selectedItems.length <= maxItemsForList && (
          <SortableList
            removeButton
            items={this.sortableListItemParse(selectedItems)}
            onChangeOrder={this.onChangeOrder}
            onRemoveElement={this.onSortableListRemove}
            inlineContent={(inlineProps) => (
              <SerieInlineConfiguration {...props} {...inlineProps} onInlineConfigChange={this.inlineConfigHandler} />
            )}
            itemsConfig={countersConfig}
            itemsIds={selectedItems}
          />
        )}
      </div>
    );
  };

  generateModalBody = () => {
    return (
      <div>
        <Loader overlay show={this.props.loading} />
        {/* Interfaz */}
        <div className="row">
          {this.gridContainer()}
          {this.props.showConfiguration && this.sortableListContainer()}
        </div>

        <SweetAlert
          showCancelButton
          show={this.state.showCustomAggregationInput}
          title="Aggregation Value"
          text={`Enter a custom aggregation value or expression, allowed ones are: ${customAggregationLevels}, ${customAggregationSigns}`}
          type="input"
          inputType="text"
          inputValue={this.state.customAggregationInputValue}
          inputPlaceholder="example: LOG2*5"
          onConfirm={this.handleConfirmCustomAggregationInput}
          onCancel={this.handleCancelCustomAggregationInput}
        />
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
