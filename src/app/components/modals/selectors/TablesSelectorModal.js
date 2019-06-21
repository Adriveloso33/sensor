import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import SweetAlert from 'sweetalert-react';

import GridTable from 'wdna-grid-table';
import SortableList from '../../list/SortableList';
import ToogleItem from '../components/ToogleItem';

import Loader from '../../dashboards/components/Loader';

import { validateAggregationExpression } from '../../../helpers/GlobalHelper';

import { warningMessage, errorMessage } from '../../notifications';

const defaultGridHiddenCols = ['COL_3', 'COL_5', 'COL_6', 'COL_7'];
const maxSelectedElements = 10;

const customAggregationLevels =
  'SUM, MAX, MIN, AVG, EXP, POW, SIN, TAN, COS, PI, RADIANS, SQRT, LOG, LOG10, LOG2, LN, DEGREES, COUNT, ROUND, FORMAT, COALESCE, IFNULL, IF';

const customAggregationSigns = '+, -, *, /, <, >';
const maxColumns = 10;

const btnCellStyle = {
  textAlign: 'center',
};

const defaultCellStyle = {
  textAlign: 'left',
};

export default class TablesSelectorModal extends React.Component {
  constructor(props) {
    super(props);

    this.$modal = null;
    this.$el = document.getElementById('#modals-div');

    this.state = {
      loading: false,

      selectedItems: [],
      customCountersAggregation: {},

      tableKey: getStr(),

      moreInfo: false,
      hiddenCols: defaultGridHiddenCols,

      // custom aggregation sweetalert
      showCustomAggregationInput: false,
      customAggregationInputId: null,
      customAggregationInputValue: null,
    };
  }

  /* React Lifecycle methods */
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

      this.autoSizeGridColumns();
    };

    const selectedItems = _.cloneDeep(this.props.selectedItems);
    const customCountersAggregation = _.cloneDeep(this.props.customCountersAggregation);

    this.setState(
      {
        selectedItems,
        customCountersAggregation,
        tableKey: getStr(),
      },
      show
    );
  };

  hideModal = () => {
    $(this.$modal).modal('hide');
  };

  searchForItemByName = (itemName) => {
    const { items } = this.props || {};

    const itemInfo = items.find((itemData) => itemData['COL_4'] === itemName);

    return itemInfo;
  };

  searchForItemById = (itemId) => {
    const { items } = this.props || {};

    const itemInfo = items.find((itemData) => itemData['COL_1'] === itemId);

    return itemInfo;
  };

  /* General Handlers */
  handleChanges = (event) => {
    const { target } = event || {};
    const { name, value } = target || {};

    this.setState({
      [name]: value,
    });
  };

  handleSave = () => {
    this.handleSaveAlternative();

    const { onSave } = this.props || {};
    const { selectedItems, customCountersAggregation } = this.state || {};

    if (typeof onSave === 'function') onSave(selectedItems, customCountersAggregation);
  };

  handleSaveAlternative = () => {
    const { onSaveAlternative } = this.props || {};
    const { selectedItems, customCountersAggregation } = this.state || {};

    let items = [];

    selectedItems.forEach((item) => {
      const itemInfo = this.searchForItemById(item);

      const newItem = {
        id: itemInfo['COL_1'],
        name: itemInfo['COL_4'],
      };
      items.push(newItem);
    });

    if (typeof onSaveAlternative === 'function') onSaveAlternative(items, customCountersAggregation);
  };

  handleCancel = () => {
    const { onCancel } = this.props || {};

    if (typeof onCancel === 'function') onCancel();
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
    const { customCountersAggregation, customAggregationInputId } = this.state || {};
    const currentCountersAgg = _.cloneDeep(customCountersAggregation);

    currentCountersAgg[customAggregationInputId] = value.toUpperCase();

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

  handleCancelCustomAggregationInput = (value) => {
    this.handleShowCustomAggregationInput(false);
  };

  /* Grid Helpers */
  customCellRender = (props = {}) => {
    const { selectedItems, customCountersAggregation } = this.state || {};

    const { value } = props || {},
      counterId = props.data['COL_1'];

    const { colDef } = props;
    const { field } = colDef || {};

    let childProps = {},
      ChildComponent = null;

    switch (field) {
      case 'COL_1':
        childProps = {
          ...props,
          onAdd: this.onAddHandler,
          onRemove: this.onRemoveHandler,
          selected: selectedItems.indexOf(value) != -1,
        };
        ChildComponent = ToogleItem;
        break;

      /*case 'COL_3':
        childProps = {
          ...props,
          id: counterId,
          value: customCountersAggregation[counterId] || this.getCounterAggregation(counterId),
          onSelect: this.onSelectAggregationHandler
        };
        ChildComponent = AggregationSelect;
        break;
        */
      default:
        break;
    }

    if (!ChildComponent) return <span>{value}</span>;

    return <ChildComponent {...childProps} />;
  };

  /* Add/Remove Handler */
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

  /* Aggregation support handlers */
  onSelectAggregationHandler = (id, value) => {
    const { customCountersAggregation } = this.state || {};

    if (value === 'CUSTOM') {
      const currentCounterAggregation = customCountersAggregation[id];

      this.setState({
        showCustomAggregationInput: true,
        customAggregationInputId: id,
        customAggregationInputValue: currentCounterAggregation,
      });

      return;
    }

    const currentCountersAgg = _.cloneDeep(customCountersAggregation);

    currentCountersAgg[id] = value;

    this.setState({
      customCountersAggregation: currentCountersAgg,
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
    const hiddenCols = !moreInfo ? [] : defaultGridHiddenCols;

    this.setState({
      moreInfo: !moreInfo,
      hiddenCols,
      tableKey: getStr(),
    });
  };

  gridCellDoubleClickHandler = (params) => {
    const { data } = params || {};
    const itemId = data['COL_1'];

    const { selectedItems } = this.state || {};

    if (selectedItems.indexOf(itemId) == -1) this.onAddHandler(itemId);
    else this.onRemoveHandler(itemId);

    this.refreshGridCells();
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    this.autoSizeGridColumns();
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

  /* Sortable List functions */
  onSortableListRemove = (itemName) => {
    const itemInfo = this.searchForItemByName(itemName);
    const itemId = itemInfo['COL_1'];

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
        const itemName = itemInfo['COL_4'];
        aliasList.push(itemName);
      }
    });

    return aliasList;
  };

  sortableListItemUnParse = (selectedItemsAlias) => {
    const { items } = this.props || {};

    const idsList = [];
    selectedItemsAlias.forEach((itemName) => {
      const itemInfo = this.searchForItemByName(itemName);

      if (itemInfo) {
        const itemId = itemInfo['COL_1'];
        idsList.push(itemId);
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

    alias['COL_1'] = 'ACTION';

    return (
      <div>
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
                  <div className="col-sm-12 col-md-7 col-lg-7 grid-container" key={this.state.tableKey}>
                    <GridTable
                      data={items}
                      alias={alias}
                      hiddenCols={hiddenCols}
                      onGridReady={this.onGridReady}
                      customCellStyles={this.generateCellStyles()}
                      search={true}
                      exportBtn={false}
                      filtersBtn={false}
                      resetBtn={false}
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
                  <div className="col-sm-12 col-md-5 col-lg-5 sortable-list-container">
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
  }

  render() {
    return ReactDOM.createPortal(this.modalContainer(), this.$el);
  }
}

TablesSelectorModal.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
