import React from 'react';
import PropTypes from 'prop-types';

import GridTable from 'wdna-grid-table';
import { warningMessage } from '../../notifications';
import SortableList from '../../list/SortableList';
import ToogleItem from './ToogleItem';

 

export default class SelectModal extends React.Component {
  constructor(props) {
    super(props);

    // generate some randoms ids for the tabs
    this.tabsIds = [];
    for (let i = 0; i < 10; i++) this.tabsIds[i] = getStr();

    this.$modal = null;
    this.state = {
      loading: false,
      selectedItems: [],
      tableKey: getStr(),

      moreInfo: false
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {}

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

      setTimeout(() => {
        //   this.gridApi.sizeColumnsToFit();
      }, 0);
    };

    const selectedItems = _.cloneDeep(this.props.selectedItems);

    this.setState(
      {
        selectedItems,
        tableKey: getStr()
      },
      show
    );
  };

  hideModal = () => {
    $(this.$modal).modal('hide');
  };

  searchForItemByName = (itemName) => {
    const { items } = this.props || {};

    const itemInfo = items.find((itemData) => itemData['text'] === itemName);

    return itemInfo;
  };

  searchForItemById = (itemId) => {
    const { items } = this.props || {};

    const itemInfo = items.find((itemData) => itemData['id'] === itemId);

    return itemInfo;
  };

  startLoading = () => {
    this.setState({
      loading: true
    });
  };

  finishLoading = () => {
    this.setState({
      loading: false
    });
  };

  onGridReady = (params) => {
    this.gridApi = params.api;

    setTimeout(() => {
      //   params.api.sizeColumnsToFit();
    }, 0);
  };

  /* Handlers */
  handleChanges = (event) => {
    const { target } = event || {};
    const { name, value } = target || {};

    this.setState({
      [name]: value
    });
  };

  handleSave = (event) => {
    const { onSave } = this.props || {};
    const { selectedItems } = this.state || {};

    if (typeof onSave === 'function') onSave(selectedItems);
  };

  handleCancel = (event) => {
    const { onCancel } = this.props || {};

    if (typeof onCancel === 'function') onCancel();
  };

  handleFormTextSave = (values) => {
    const newSelection = values ? values.slice() : [];

    this.setState({
      selectedItems: newSelection
    });
  };

  /* Grid Helpers */
  customCellRender = (props) => {
    const { selectedItems } = this.state || {};
    const { value } = props || {};

    const newProps = {
      ...props,
      onAdd: this.onAddHandler,
      onRemove: this.onRemoveHandler,
      targetColumnName: 'id',
      selected: selectedItems.indexOf(value) != -1
    };

    return <ToogleItem {...newProps} />;
  };

  onAddHandler = (value) => {
    const { selectedItems } = this.state || {};
    const { maxSelectedElements } = this.props || null;

    if (selectedItems.length >= maxSelectedElements) {
      warningMessage('Warning', 'Reached the limit of selected elements');
      this.refreshGridCells();
      return;
    }

    let newSelection = selectedItems.slice();
    newSelection.push(value);

    this.setState(
      {
        selectedItems: newSelection
      },
      () => {
        if (maxSelectedElements == 1 && newSelection.length == 1) {
          this.handleSave();
          return;
        }
      }
    );
  };

  onRemoveHandler = (value) => {
    let { selectedItems } = this.state || {};

    let newSelection = selectedItems.filter((elem) => elem !== value);

    this.setState({
      selectedItems: newSelection
    });
  };

  /* Grid ToolPanel buttons */
  resetSelection = () => {
    this.setState({
      selectedItems: [],
      tableKey: getStr()
    });
  };

  gridCellDoubleClickHandler = (params) => {
    const { data } = params || {};
    const itemId = data['id'];

    const { selectedItems } = this.state || {};

    if (selectedItems.indexOf(itemId) == -1) this.onAddHandler(itemId);
    else this.onRemoveHandler(itemId);

    this.refreshGridCells();
  };

  refreshGridCells = () => {
    setTimeout(() => {
      this.gridApi.redrawRows();
    }, 0);
  };

  /* Sortable List functions */
  onSortableListRemove = (itemName) => {
    const itemInfo = this.searchForItemByName(itemName);
    const itemId = itemInfo['id'];

    this.onRemoveHandler(itemId);
    this.refreshGridCells();
  };

  onChangeOrder = (selectedItemsAlias) => {
    const selectedItems = this.sortableListItemUnParse(selectedItemsAlias);

    this.setState({
      selectedItems
    });
  };

  sortableListItemParse = (selectedItems) => {
    const { items } = this.props || {};

    const aliasList = [];
    selectedItems.forEach((itemId) => {
      const itemInfo = this.searchForItemById(itemId);

      if (itemInfo) {
        const itemName = itemInfo['text'];
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
        const itemId = itemInfo['id'];
        idsList.push(itemId);
      }
    });

    return idsList;
  };

  render() {
    const { props, tabsIds } = this;
    const { items, alias, title } = props || {};
    const { moreInfo, selectedItems } = this.state || {};

    const tab1Id = `tab_${tabsIds[0]}`,
      tab2Id = `tab_${tabsIds[1]}`;

    alias['id'] = 'ACTION';
    alias['text'] = 'NAME';

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
        data-keyboard="false"
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
              {/* Interfaz */}
              <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-6 grid-container" key={this.state.tableKey}>
                  <GridTable
                    data={items}
                    alias={alias}
                    onGridReady={this.onGridReady}
                    search={true}
                    exportBtn={false}
                    filtersBtn={false}
                    resetBtn={false}
                    toolPanelButtons={[
                      {
                        text: 'Reset Selection',
                        class: 'grid-reset-btn',
                        action: this.resetSelection
                      }
                    ]}
                    customCellRendererFramework={this.customCellRender}
                    options={{
                      onCellDoubleClicked: this.gridCellDoubleClickHandler,
                      enableFilter: true,
                      enableStatusBar: true,
                      alwaysShowStatusBar: false,
                      rowSelection: 'multiple',
                      pagination: false
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
                Select
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
}

SelectModal.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired
};
