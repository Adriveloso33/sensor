import React from 'react';
import PropTypes from 'prop-types';

import GridTable from 'wdna-grid-table';
import SweetAlert from 'sweetalert-react';

import ContainerModal from '../../generics/ContainerModal';

import TextItemsSelector from '../../components/TextItemsSelector';
import ToogleItem from '../../components/ToogleItem';

import { warningMessage, errorMessage } from '../../../notifications';

import Loader from '../../../dashboards/components/Loader';

const ACTION_BUTTONS_COL_ID = 'COL_0';
const NE_NAME_COL_ID = 'COL_1';

const minimunFilterValidLen = 3; // provide 3 chars at least for filter selection

const btnCellStyle = {
  textAlign: 'center',
};

const defaultCellStyle = {
  textAlign: 'left',
};

export default class NetworkSelectorModal extends React.Component {
  static contextTypes = {
    parentState: PropTypes.object.isRequired,
    updateParent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    alias: {},
    hiddenCols: Array.from(Array(25).keys()).map((e, i) => `COL_${i + 2}`),
    maxItemsSelection: null,
    minItemsSelection: null,
  };

  static propTypes = {
    items: PropTypes.array,
    alias: PropTypes.object,
    hiddenCols: PropTypes.array,
    maxItemsSelection: PropTypes.number,
    minItemsSelection: PropTypes.number,
  };

  constructor(props) {
    super(props);

    // generate some randoms ids for the tabs
    this.tabsIds = [];
    for (let i = 0; i < 10; i++) this.tabsIds[i] = getStr();

    this.ULId = getStr();
    this.modalRef = null;
    this.selectionWasChanged = false;

    this.state = {
      selectedItems: [],
      tableKey: getStr(),
      moreInfo: false,
      showOnlySelected: false,
      showConfirmationAlert: false,
    };

    this.nameColId = props.nameColId || NE_NAME_COL_ID;
    this.buttonsColId = props.buttonsColId || ACTION_BUTTONS_COL_ID;
  }

  /* React Lifecycle methods */
  componentDidMount() {
    $(this.modalRef).on('show.bs.modal', () => {
      this.autoSizeGridColumns();
    });
  }

  componentWillReceiveProps(nextProps) {
    const { show } = nextProps || {};

    // handle show modal
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
      showOnlySelected: false,
      tableKey: getStr(),
    });
  };

  searchForItemByName = (itemName) => {
    const { items } = this.props || {};

    const itemInfo = items.find((itemData) => itemData[this.nameColId] === itemName);

    return itemInfo;
  };

  searchForItemById = (itemId) => {
    const { items } = this.props || {};

    const itemInfo = items.find((itemData) => itemData[this.nameColId] === itemId);

    return itemInfo;
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
    try {
      this.validateSelection();

      const { onSave } = this.props;
      const { selectedItems } = this.state;

      if (typeof onSave === 'function') onSave(selectedItems);
    } catch (Ex) {
      errorMessage('Error', Ex);
    }
  };

  validateSelection = () => {
    const { minItemsSelection, maxItemsSelection } = this.props;
    const selectionLength = this.state.selectedItems.length;

    const isMinBoundWrong = minItemsSelection && selectionLength < minItemsSelection;
    if (isMinBoundWrong) throw new Error(`Please select at least ${minItemsSelection} elements`);

    const isMaxBoundWrong = maxItemsSelection && selectionLength > maxItemsSelection;
    if (isMaxBoundWrong) throw new Error(`Reached the limit of selected elements (${maxItemsSelection})`);

    return null;
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

  handleFormTextSave = (values) => {
    const newSelection = values ? values.slice() : [];

    this.selectionWasChanged = true;

    this.setState(
      {
        selectedItems: newSelection,
      },
      this.refreshGridCells
    );
  };

  /* Grid Helpers */
  customCellRender = (props) => {
    const { selectedItems } = this.state || {};
    const { value } = props || {};

    const { colDef } = props;
    const { field } = colDef || {};

    let childProps = {};
    let ChildComponent = null;

    switch (field) {
      case ACTION_BUTTONS_COL_ID:
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
    this.selectionWasChanged = true;

    this.setState((prevState) => {
      const newSelection = prevState.selectedItems.slice();
      newSelection.push(value);

      return {
        selectedItems: newSelection,
      };
    });
  };

  onRemoveHandler = (value) => {
    this.selectionWasChanged = true;

    this.setState((prevState) => {
      return {
        selectedItems: prevState.selectedItems.filter((elem) => elem !== value),
      };
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

  toggleGridNeInfo = () => {
    const { moreInfo } = this.state || {};

    this.setState({
      moreInfo: !moreInfo,
      tableKey: getStr(),
    });

    this.autoSizeGridColumns();
  };

  gridCellDoubleClickHandler = (params) => {
    const { data } = params || {};
    const itemId = data[this.nameColId];

    const { selectedItems } = this.state || {};

    if (selectedItems.indexOf(itemId) === -1) this.onAddHandler(itemId);
    else this.onRemoveHandler(itemId);

    this.refreshGridCells();
  };

  refreshGridCells = () => {
    setTimeout(() => {
      this.gridApi.redrawRows();
    }, 0);
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    this.autoSizeGridColumns();
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

    if (itemInfo) {
      // is a element from the table
      const itemId = itemInfo[this.nameColId];

      this.onRemoveHandler(itemId);
      this.refreshGridCells();
    } else {
      this.setState((prevState) => {
        return {
          selectedItems: prevState.selectedItems.filter((elem) => elem !== itemName),
        };
      }, this.refreshGridCells);
    }
  };

  onChangeOrder = (selectedItemsAlias) => {
    const selectedItems = this.sortableListItemUnParse(selectedItemsAlias);

    this.setState(
      {
        selectedItems,
      },
      this.refreshGridCells
    );
  };

  sortableListItemParse = (selectedItems = []) => {
    const aliasList = [];

    selectedItems.forEach((itemId) => {
      let itemName = itemId;

      const itemInfo = this.searchForItemById(itemId);
      if (itemInfo) itemName = itemInfo[this.nameColId];

      aliasList.push(itemName);
    });

    return aliasList;
  };

  sortableListItemUnParse = (selectedItemsAlias = []) => {
    const idsList = [];

    selectedItemsAlias.forEach((itemName) => {
      let itemId = itemName;

      const itemInfo = this.searchForItemByName(itemName);
      if (itemInfo) itemId = itemInfo[this.nameColId];

      idsList.push(itemId);
    });

    return idsList;
  };

  generateCellStyles = () => {
    const cellStyles = {};

    cellStyles.id = btnCellStyle;
    cellStyles.text = defaultCellStyle;

    return cellStyles;
  };

  addActionColumn = (rawData = []) => {
    const dataWithActionColumn = rawData.map((row) => {
      return {
        [this.buttonsColId]: row[this.nameColId],
        ...row,
      };
    });

    return dataWithActionColumn;
  };

  selectAllAfterFilter = () => {
    const selection = this.state.selectedItems.slice();

    const areGridFiltersValids = this.areFlotatingFiltersValids() || this.isQuickFilterValid();

    if (!areGridFiltersValids) {
      warningMessage('Warning', 'Please filter the results first');
      return;
    }

    this.gridApi.forEachNodeAfterFilter((rowNode) => {
      const { data = {} } = rowNode;
      const itemId = data[this.nameColId];

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

  toggleShowSelection = () => {
    const { selectedItems } = this.state;
    if (selectedItems.length === 0) {
      warningMessage('Warning', 'Select at least one item');
      return;
    }

    this.setState((prevState) => {
      return {
        showOnlySelected: !prevState.showOnlySelected,
      };
    }, this.updateFilterStatus);
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
    const columnFilterComponent = this.gridApi.getFilterInstance(ACTION_BUTTONS_COL_ID);
    columnFilterComponent.selectEverything();
    this.gridApi.onFilterChanged();
  };

  setFilterValues = (values) => {
    const columnFilterComponent = this.gridApi.getFilterInstance(ACTION_BUTTONS_COL_ID);

    columnFilterComponent.selectNothing();
    for (let i = 0; i < values.length; i++) {
      columnFilterComponent.selectValue(values[i]);
    }

    this.gridApi.onFilterChanged();
  };

  isQuickFilterValid = () => {
    if (!this.gridApi.isQuickFilterPresent()) return false;

    let quickFilterValue = '';

    // undocumented grid api option, thats is the reason of try-catch block
    try {
      quickFilterValue = this.gridApi.filterManager.quickFilter;
    } catch (ex) {
      console.warn(ex);
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

  generateColumnFilters = () => {
    const filters = {
      [this.buttonsColId]: 'agSetColumnFilter',
    };

    const { items } = this.props;
    if (!items || !items[0]) return filters;

    const firstRow = items[0];
    Object.keys(firstRow).forEach((key) => {
      filters[key] = 'agTextColumnFilter';
    });

    return filters;
  };

  generateModalBody = () => {
    const { props, tabsIds } = this;
    const { items, alias, hiddenCols } = props;
    const { selectedItems, moreInfo } = this.state;

    const tab1Id = `tab_${tabsIds[0]}`;
    const tab2Id = `tab_${tabsIds[1]}`;

    const dataWithActionColumn = this.addActionColumn(items);
    alias[this.buttonsColId] = 'ACTION';

    return (
      <div>
        <Loader show={props.loading} overlay />
        {/* Interfaz */}
        <div className="ne-selection-count">
          <h1>{`Selected ${selectedItems.length} elements`}</h1>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
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
                      filtersBtn
                      exportBtn={false}
                      resetBtn={false}
                      data={dataWithActionColumn}
                      alias={alias}
                      hiddenCols={moreInfo ? [] : hiddenCols}
                      onGridReady={this.onGridReady}
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
                          text: moreInfo ? 'Less Info' : 'More Info',
                          class: 'grid-reset-btn',
                          action: this.toggleGridNeInfo,
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
                        pagination: true,
                        suppressColumnVirtualisation: true,
                      }}
                    />
                  </div>
                </div>

                <div className="tab-pane grid-container" id={tab2Id}>
                  <TextItemsSelector values={selectedItems} onSave={this.handleFormTextSave} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  genericModalContainer = (content) => (
    <ContainerModal
      fullScreenButton
      show={this.props.show}
      title={this.props.title}
      modalClass="modal-lg selector-modal"
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
