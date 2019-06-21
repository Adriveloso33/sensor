import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { SortablePane, Pane } from 'react-sortable-pane';

import { addTab } from '../../tabs/TabsActions';
// import CustomReportWizardDashboard
// from '../../../routes/analytics/components/customreports/CustomReportWizardDashboard';
import { warningMessage } from '../../notifications';

import { getRouteParams } from '../../../helpers/RouteHelper';
import SaveDashboardModal from './modals/SaveDashboardModal';

import { config } from '../../../config/config';
import Auth from '../../auth/Auth';

const minHeightPane = 400;
const maxRows = 5;
const marginPane = 20;

class ConfigDashboard extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.bodyRef = React.createRef();

    this.sortablePanelRef = [];
    this.sortablePanelKey = [];
    this.sortableRowKey = [];

    this.filterTypes = [];

    this.state = {
      mainFilter: {},
      noData: false,
      order: [],
      panes: [],
      showModal: false,
    };
  }

  componentDidMount() {
    const { id } = this.props;

    id ? this.loadConfiguration(id) : this.init();
  }

  componentWillReceiveProps(nextProps) {
    this.checkNewProps(nextProps);
  }

  setData = (data) => {
    const { filterTypes } = data;
    const { state } = data;

    const { order } = state;

    order.forEach((element, nrow) => {
      if (!this.sortablePanelRef[nrow]) this.sortablePanelRef[nrow] = React.createRef();
      if (!this.sortablePanelKey[nrow]) this.sortablePanelKey[nrow] = getStr();
      if (!this.sortableRowKey[nrow]) this.sortableRowKey[nrow] = getStr();
    });

    this.filterTypes = filterTypes;

    this.setState({ ...state });
  };

  setFilterTypes(filterTypes) {
    this.filterTypes = filterTypes;
  }

  setFilterPane(nrow, id, filter) {
    const { panes } = this.state;
    panes[nrow][id].filter = filter;

    this.setState({
      panes,
    });
  }

  checkNewProps = (nextProps) => {
    if (this.props !== nextProps) {
      const { configDashboard } = nextProps || {};
      const { filter } = configDashboard || {};
      const { idTab, data, element, nrow, filterTypes } = filter || {};

      if (idTab === this.idTab()) {
        this.setFilterTypes(filterTypes);
        this.setFilterPane(nrow, element, data);
      }
    }
  };

  loadConfiguration = (id) => {
    axios
      .get(`${config.apiRootUrl}/entropy/panelconfig/load`, {
        params: {
          api_token: Auth.getToken(),
          id,
        },
      })
      .then((response) => {
        let data = response.data;
        const { panelconfig_configuration } = data;

        this.setData(panelconfig_configuration);
      })
      .catch((error) => {
        reject(error.response);
      });
  };

  init = () => {
    // Ponemos el timeout, para que esperar que este el html totalmente cargado
    setTimeout(() => {
      this.addRow();
    }, 0);
  };
  // =======================
  //         TABS
  // =======================

  idTab = () => {
    const routePrams = getRouteParams(this.context.router);
    const id = routePrams.tabId;

    return id;
  };

  tabConfigDashboard = (nrow, element, filter = null) => {
    const dataTab = {
      id: getStr(),
      title: 'Config dashboard',
      active: true,
      component: CustomReportWizardDashboard,
      props: {
        title: 'Config dashboard',
        configDashboard: {
          idTab: this.idTab(),
          nrow,
          element,
        },
        filter,
        filterTypes: {
          delta: {
            active: false,
          },
          chartcompare: {
            active: false,
          },
        },
      },
    };

    return dataTab;
  };

  loadTab = (nrow, npane) => {
    const configTab = this.tabConfigDashboard(nrow, npane);

    store.dispatch(addTab(configTab));
  };

  editTab = (nrow, npane) => {
    const filterImport = this.filterPane(nrow, npane);

    const configTab = this.tabConfigDashboard(nrow, npane, filterImport);

    store.dispatch(addTab(configTab));
  };

  // =======================
  //        HANDLE
  // =======================

  orderChange = (nrow, newOrder) => {
    let { order } = this.state;

    order[nrow] = newOrder;

    this.setState({ order });
  };

  changeWidth = (nrow, key, d) => {
    const addWidth = d.width;
    const addHeight = d.height;
    let { panes } = this.state;

    if (addWidth) this.updatePanesWidth(nrow, panes, key, addWidth);
    if (addHeight) this.updatesPanesHeight(nrow, panes, key, addHeight);

    this.setState(
      {
        panes,
      },
      () => {
        if (addWidth) this.refreshPanes(nrow);
      }
    );
  };

  // =======================
  //        PANE
  // =======================

  newKeys = (nrow) => {
    if (!this.sortablePanelRef[nrow]) this.sortablePanelRef[nrow] = React.createRef();
    if (!this.sortablePanelKey[nrow]) this.sortablePanelKey[nrow] = getStr();
  };

  rowPane = (nrow) => {
    const { panes } = this.state;

    return panes[nrow];
  };

  newPane = (options) => {
    const { width, height, classValue, type } = options || {};

    const pane = {
      height: $.isNumeric(height) ? height : minHeightPane,
      width: $.isNumeric(width) ? width : 100,
      classValue: classValue || null,
      type: type || 'column',
      filter: null,
    };

    return pane;
  };

  totalElementsPaneRow = (nrow) => {
    const rowPane = this.rowPane(nrow);

    return this.totalElementsPane(rowPane);
  };

  totalElementsPane = (paneRow) => {
    return Object.keys(paneRow).length;
  };

  refreshPanes = (nrow) => {
    this.sortablePanelKey[nrow] = getStr();
    this.refreshRowKey(nrow);
  };

  refreshAllRows = () => {
    this.sortableRowKey.map(() => {
      return getStr();
    });
  };

  refreshAll = () => {
    this.refreshAllPanes();
    this.refreshAllRows();
  };

  refreshAllPanes = () => {
    this.sortablePanelKey.map(() => {
      return getStr();
    });
  };

  refreshRowKey = (nrow) => {
    this.sortablePanelKey[nrow] = getStr();
  };

  keyRowAvailable = () => {
    const { panes } = this.state;
    const keys = [];
    panes.forEach((element, index) => {
      keys.push(index);
    });

    const keyAvailable = keys.length ? Math.max.apply(null, keys) + 1 : 0;

    return keyAvailable;
  };

  filterPane = (nrow, npane) => {
    const filterPane = _.get(this.state, `panes[${nrow}][${npane}].filter`, null);

    return filterPane;
  };

  // =======================
  //        ROW
  // =======================

  isMaxRows = () => {
    const { panes } = this.state;

    return panes.length >= maxRows;
  };

  addRow = () => {
    if (this.isMaxRows()) {
      warningMessage('Warning', `Max rows: ${maxRows}`);
      return null;
    }

    const { panes, order } = this.state;
    const maxWidth = this.availableWidth(null, null, this.parentWidth());
    const newRow = this.keyRowAvailable();

    const newPane = {};

    const newKey = this.paneKey(newRow, 0);
    newPane[newKey] = this.newPane(maxWidth);

    const newKeyAdder = this.paneAdderKey(newRow);
    newPane[newKeyAdder] = this.newPaneAdder({ width: 0 });

    panes[newRow] = newPane;
    order[newRow] = [newKey, newKeyAdder];

    this.sortableRowKey[newRow] = getStr();

    this.setState({
      panes,
      order,
    });
  };

  deleteRow = (nrow) => {
    let { panes, order } = this.state;

    panes = panes.filter((item, key) => key !== nrow);
    order = order.filter((item, key) => key !== nrow);
    this.sortableRowKey = this.sortableRowKey.filter((item, key) => key !== nrow);

    this.setState({
      panes,
      order,
    });
  };

  // =======================
  //      PANE SIZE
  // =======================

  availableWidths = () => {
    const widths = [
      {
        width: 1 / 3,
        classValue: 4,
      },
      {
        width: 1 / 2,
        classValue: 6,
      },
      {
        width: 2 / 3,
        classValue: 8,
      },
      {
        width: 1,
        classValue: 12,
      },
    ];

    return widths;
  };

  classToPercent = (classValue) => {
    const widthPercent = ((classValue * 100) / 12).toFixed(2);

    return widthPercent;
  };

  availableWidthsValues = () => {
    const availableWidths = this.availableWidths();

    const widths = availableWidths.map((value) => {
      return value.width;
    });

    return widths;
  };

  availableWidthsValuesRelative = () => {
    const widthsRelative = this.availableWidthsValues();
    const parentWidth = this.parentWidth();

    const widths = widthsRelative.map((width) => width * parentWidth);

    return widths;
  };

  availableWidth = (panes = null, paneKey = null, actualWith) => {
    const widths = this.availableWidthsValuesRelative();

    const closestValue = widths.reduce((prev, curr) => {
      return Math.abs(curr - actualWith) < Math.abs(prev - actualWith) ? curr : prev;
    });

    const closestValueIndex = widths.indexOf(closestValue);

    const availableWidths = this.availableWidths();
    const widthReturn = availableWidths[closestValueIndex];

    const parentWidth = this.parentWidth();
    widthReturn.width = widthReturn.width * parentWidth;

    return widthReturn;
  };

  nearAvailableWidth = (paneRow, nrow, key, addWidth) => {
    const actualWith = this.currentWidth(nrow, key) + addWidth;
    const newWidth = this.availableWidth(paneRow, key, actualWith);

    return newWidth;
  };

  currentWidth = (nrow, key) => {
    const rowPane = this.rowPane(nrow);

    return rowPane[key].width;
  };

  parentWidth = () => {
    return this.bodyRef.current.offsetWidth;
  };

  updatesPanesHeight = (nrow, panes, keyToChange, heightChanged) => {
    panes[nrow][keyToChange].height = panes[nrow][keyToChange].height + heightChanged;
  };

  totalWidthRowPane = (paneRow, keyPane = null) => {
    let maxWidthPanes = 0;

    const keysPanes = Object.keys(paneRow);
    keysPanes.forEach((key) => {
      const pane = paneRow[key];
      const { width, type } = pane;
      if (type != 'adder-pane' && key != keyPane) {
        maxWidthPanes += width;
      }
    });

    return maxWidthPanes;
  };

  totalWidthPaneRowAvailable = (paneRow) => {
    const totalWidthPane = this.totalWidthRowPane(paneRow);
    const parentWidth = this.parentWidth();
    const diffWidth = parentWidth - totalWidthPane;

    return diffWidth;
  };

  maxSizeRow = (nrow) => {
    const { panes } = this.state;
    const row = panes[nrow];

    const keysPanes = Object.keys(row);
    let heights = [];
    keysPanes.forEach((key) => {
      heights.push(row[key].height);
    });

    const heightMax = heights.length ? Math.max.apply(null, heights) : minHeightPane;

    return heightMax;
  };

  totalWidthRowOtherPane = (panes, paneKey) => {
    return this.totalWidthRowPane(panes, paneKey);
  };

  checkWidthPaneKey = (paneRow, key, widthChanged) => {
    const totalWidthRowOtherPane = this.totalWidthRowOtherPane(paneRow, key);
    const pane = paneRow[key];
    const widthRefresh = pane.width + widthChanged;

    const parentWidth = this.parentWidth();
    const totalWithPanes = totalWidthRowOtherPane + widthRefresh;
    const totalWithAvailable = parentWidth - totalWidthRowOtherPane - pane.width;

    const widthReturn = parentWidth - totalWithPanes < 0 ? totalWithAvailable : widthChanged;

    return widthReturn;
  };

  updatePanesWidth = (nrow, panes, keyToChange, widthChanged) => {
    const paneRow = panes[nrow];
    const keysPanes = Object.keys(paneRow);

    keysPanes.forEach((key) => {
      let width = 0;
      if (key === keyToChange) {
        width = this.checkWidthPaneKey(paneRow, key, widthChanged);
      }

      const pane = paneRow[key];
      const paneModified = this.nearAvailableWidth(paneRow, nrow, key, width);
      panes[nrow][key] = {
        ...pane,
        ...paneModified,
      };
    });

    this.updatePanesWidthAdder(nrow, panes);
  };

  // =======================
  //      MOVE PANES
  // =======================

  arrayMove = (arr, oldIndex, newIndex) => {
    if (newIndex >= arr.length) {
      const k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  };

  panesKeysUpdateRow = (paneRow, indexRow) => {
    const newPane = {};

    Object.keys(paneRow).forEach((key) => {
      const newKey = this.paneKeyMoveNewRow(key, indexRow);
      newPane[newKey] = paneRow[key];
    });

    return newPane;
  };

  rowKeyUpdate = (panes) => {
    const panesUpdate = panes.map((paneRow, indexRow) => {
      return this.panesKeysUpdateRow(paneRow, indexRow);
    });

    return panesUpdate;
  };

  paneMove = (panes, nrow, newPosition) => {
    this.arrayMove(panes, nrow, newPosition);

    return this.rowKeyUpdate(panes);
  };

  orderKeyUpdate = (order) => {
    const orderUpdate = order.map((orderRow, indexRow) => {
      return orderRow.map((key) => {
        return this.paneKeyMoveNewRow(key, indexRow);
      });
    });
    return orderUpdate;
  };

  orderMove = (order, nrow, newPosition) => {
    this.arrayMove(order, nrow, newPosition);

    return this.orderKeyUpdate(order);
  };

  rowMove = (nrow, movePosition) => {
    let { panes, order } = this.state;
    const newPosition = nrow + movePosition;

    panes = this.paneMove(panes, nrow, newPosition);
    order = this.orderMove(order, nrow, newPosition);

    this.setState(
      {
        panes,
        order,
      },
      () => {
        this.refreshAll();
      }
    );
  };

  rowMoveUp = (nrow) => {
    this.rowMove(nrow, -1);
  };

  rowMoveDown = (nrow) => {
    this.rowMove(nrow, 1);
  };

  // =======================
  //      PANE ADDER
  // =======================
  // Es el pane que se crea para indicar el espacio que sobra, y puedes pulsar en el para añadir más

  paneAdderKey = (nrow) => {
    return `${nrow}_adder`;
  };

  isAdderPane = (key) => {
    return key.endsWith('_adder');
  };

  newPaneAdder = (options) => {
    return this.paneAdder(options);
  };

  getPaneAdder = (nrow, key) => {
    const { panes } = this.state;
    const rowPane = panes[nrow];
    const paneAdderKey = this.paneAdderKey(nrow);

    return rowPane[paneAdderKey];
  };

  paneAdder = (optionsInput) => {
    let options = {
      type: 'adder-pane',
    };

    const { width, height, classValue } = optionsInput || {};
    if ($.isNumeric(width)) options.width = width;
    if ($.isNumeric(height)) options.height = height;
    if (classValue) options.classValue = classValue;

    const newPaneRow = this.newPane(options);

    return newPaneRow;
  };

  updatePanesWidthAdder = (nrow, panes) => {
    const paneRow = panes[nrow];
    let totalWidthPaneAvailable = {
      width: this.totalWidthPaneRowAvailable(paneRow),
      classValue: 'hidden',
    };
    if (totalWidthPaneAvailable.width != 0)
      totalWidthPaneAvailable = this.availableWidth(paneRow, null, totalWidthPaneAvailable.width);

    const paneAdderKey = this.paneAdderKey(nrow);

    panes[nrow][paneAdderKey] = this.paneAdder(totalWidthPaneAvailable);
  };

  paneKeyMoveNewRow = (key, newRow) => {
    return `${newRow}_${key.split('_')[1]}`;
  };

  paneKey = (nrow, number) => {
    return `${nrow}_${number}`;
  };

  columnFromPaneKey = (key) => {
    return Number(key.split('_')[1]);
  };

  rowFromPaneKey = (key) => {
    return Number(key.split('_')[0]);
  };

  paneKeyAvailable = (nrow) => {
    const { panes } = this.state;
    const paneRow = panes[nrow];
    const keys = Object.keys(paneRow);

    let i = 0;
    while (keys.includes(this.paneKey(nrow, i))) {
      i++;
    }

    return this.paneKey(nrow, i);
  };

  adderToPane = (nrow) => {
    const paneAdder = this.getPaneAdder(nrow);
    const newPane = {
      ...paneAdder,
      type: 'column',
    };

    const newPaneAdder = {
      ...paneAdder,
      width: 0,
    };

    // Add pane
    let { panes, order } = this.state;
    const paneKeyAvailable = this.paneKeyAvailable(nrow);
    panes[nrow][paneKeyAvailable] = newPane;

    // Modify order
    let newOrderRow = [];
    const orderRow = order[nrow];
    orderRow.forEach((element) => {
      this.isAdderPane(element) ? newOrderRow.push(paneKeyAvailable) : newOrderRow.push(element);
    });

    // Add paneAdder
    const paneAdderKey = this.paneAdderKey(nrow);
    panes[nrow][paneAdderKey] = newPaneAdder;
    newOrderRow.push(paneAdderKey);

    order[nrow] = newOrderRow;
    this.setState(
      {
        panes,
        order,
      },
      () => {
        this.refreshPanes(nrow);
      }
    );
  };

  // =======================
  //         FINISH
  // =======================

  onFinish = () => {
    this.closeSaveModal();

    const configurations = this.getFilter();
    this.props.onFinish({ configurations });
  };

  getFilter = () => {
    const panesOrder = this.orderPanes();
    const panes = this.getFilterFromPanes(panesOrder);

    return panes;
  };

  changeOrderPanesAndRemoveTrash = (arr, newOrder) => {
    const arrOrdered = [];

    newOrder.forEach((index) => {
      const pane = arr[index];
      const { filter } = pane;

      if (!this.isAdderPane(index) && pane && filter) arrOrdered.push(arr[index]);
    });

    return arrOrdered;
  };

  orderPanes = () => {
    const { order, panes } = this.state;

    const orderAllPanes = panes.map((row, nrow) => {
      const orderIndexPanes = order[nrow];
      const orderPanes = this.changeOrderPanesAndRemoveTrash(row, orderIndexPanes);

      return orderPanes;
    });

    return orderAllPanes;
  };

  getFilterFromPanes = (panes) => {
    const filterPanes = panes.map((row, nrow) => {
      let panesRow = [];
      const paneAdderKey = this.paneAdderKey(nrow);

      Object.keys(row).forEach((paneKey) => {
        if (paneKey != paneAdderKey) {
          let paneItem = row[paneKey];
          paneItem['column'] = this.columnFromPaneKey(paneKey);

          panesRow.push(paneItem);
        }
      });

      return panesRow;
    });

    return filterPanes;
  };

  // =======================
  //          MOdal
  // =======================

  openSaveModal = () => {
    this.checkRequired(this.handleSaveModal);
  };

  closeSaveModal = () => {
    this.handleSaveModal(false);
  };

  handleSaveModal = (showModal = false) => {
    this.setState({
      showModal,
    });
  };

  panelConfiguration = () => {
    const { order, panes } = this.state;
    const state = {
      order,
      panes,
    };

    const { sortablePanelKey, sortableRowKey, filterTypes } = this;

    const configuration = {
      state,
      sortablePanelKey,
      sortableRowKey,
      filterTypes,
    };

    return configuration;
  };

  saveData = (parameters) => {
    const url = `${config.apiRootUrl}/entropy/panelconfig`;
    const configuration = this.getFilter();
    const panelconfig_configuration = this.panelConfiguration();

    axios
      .post(url, {
        api_token: Auth.getToken(),
        ...parameters,
        options: null,
        configuration,
        panelconfig_configuration,
      })
      .then(() => {
        this.onFinish();
      })
      .catch((error) => {
        reject(error);
      });
  };

  updateData = (id, parameters) => {
    const url = `${config.apiRootUrl}/entropy/panelconfig/update`;
    const configuration = this.getFilter();
    const panelconfig_configuration = this.panelConfiguration();

    axios
      .post(url, {
        api_token: Auth.getToken(),
        id,
        ...parameters,
        options: null,
        configuration,
        panelconfig_configuration,
      })
      .then(() => {
        this.onFinish();
      })
      .catch((error) => {
        reject(error);
      });
  };

  handleSelectorModal = (parameters) => {
    const { id } = this.props;
    console.log('id :', id);
    id ? this.updateData(id, parameters) : this.saveData(parameters);
  };

  // =======================
  //       CHECK REQUIRED
  // =======================
  checkPanesWithFilter = () => {
    const { panes } = this.state;
    let totalFilters = 0;

    panes.forEach((paneRow) => {
      const keysPanes = Object.keys(paneRow);
      keysPanes.forEach((pane) => {
        const { filter } = paneRow[pane] || {};
        if (filter) totalFilters++;
      });
    });

    return totalFilters;
  };

  checkRequired = (cb) => {
    const existFilters = this.checkPanesWithFilter();

    if (existFilters) {
      if (typeof cb === 'function') cb(true);
    } else {
      warningMessage('Error', 'Please, add filters');
    }
  };

  // =======================
  //          HTML
  // =======================

  paneAdderHtml = (key, paneConfig, nrow) => {
    const paneStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'solid 1px #ddd',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
    };

    const textStyle = {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#aaa',
    };

    return (
      <Pane
        key={key}
        style={paneStyle}
        resizable={{ y: false, x: false, xy: false }}
        size={{
          width: `${this.classToPercent(paneConfig.classValue)}%`,
          height: paneConfig.height,
        }}
        className={paneConfig.width ? '' : 'hidden'}
      >
        <span style={{ display: 'block' }}>
          <p style={textStyle}>{`Size ${paneConfig.classValue}/12`}</p>
          <fieldset>
            <div className="cl-element">
              <button type="button" className="play-btn btn btn-default" onClick={() => this.adderToPane(nrow)}>
                <i className="fa fa-plus" />
                <span> Add column</span>
              </button>
            </div>
          </fieldset>
        </span>
      </Pane>
    );
  };

  paneHTML = (key, paneConfig, nrow) => {
    const paneStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'solid 1px #ddd',
      backgroundColor: null,
      textAlign: 'center',
      borderWidth: '0px 5px 5px 0px',
      borderColor: '#666',
    };

    // Modify color background (Depend of type: table, graph,...)
    const type = _.get(paneConfig, 'filter.type', null);
    const { filter = null } = paneConfig || {};

    const defaultBackgroundColor = '#f0f0f0';
    paneStyle.backgroundColor = type
      ? _.get(this.filterTypes[type], 'options.backgroundColor', defaultBackgroundColor)
      : defaultBackgroundColor;

    const textTitleHTML = this.paneHTMLTitle(paneConfig, type);

    return (
      <Pane
        key={key}
        style={paneStyle}
        resizable={{ y: true, x: true, xy: false }}
        size={{
          width: `${this.classToPercent(paneConfig.classValue)}%`,
          height: paneConfig.height,
        }}
        minHeight={minHeightPane}
      >
        <img style={{ position: 'absolute', right: '-4px', height: '15px' }} src="assets/img/triangle-left.svg" />
        <img style={{ position: 'absolute', bottom: '0px', width: '10px' }} src="assets/img/triangle-up.svg" />
        <span style={{ display: 'block' }}>
          {textTitleHTML}
          <fieldset>
            <div className="cl-element">
              {!filter && (
                <button type="button" className="play-btn btn btn-default" onClick={() => this.loadTab(nrow, key)}>
                  <i className="fa fa-plus" />
                  <span> Add filter</span>
                </button>
              )}
              {filter && (
                <button type="button" className="play-btn btn btn-default" onClick={() => this.editTab(nrow, key)}>
                  <i className="fa fa-plus" />
                  <span> Edit filter</span>
                </button>
              )}
            </div>
          </fieldset>
        </span>
      </Pane>
    );
  };

  paneHTMLTitle = (paneConfig, existBackgroundColor) => {
    const textStyleSize = {
      fontSize: '16px',
      fontWeight: 'normal',
      color: existBackgroundColor ? '#FFF' : '#aaa',
    };

    const textStyleTitle = {
      fontSize: '16px',
      fontWeight: 'bold',
      color: existBackgroundColor ? '#FFF' : '#333',
      margin: 0,
    };

    const title = _.get(paneConfig, 'filter.title', null);
    const type = _.get(paneConfig, 'filter.type', null);

    const textSize = `Size: ${paneConfig.classValue}/12`;
    let textSizeHTML = <p style={textStyleSize}>{textSize}</p>;
    let typeHTML = '';

    if (_.isString(type)) {
      typeHTML = (
        <span style={textStyleTitle}>
          <br />
          {`${type.toUpperCase()}`}
        </span>
      );
    }

    if (_.isString(title)) {
      textSizeHTML = (
        <p style={textStyleTitle}>
          {`Title: ${title || 'None'}`}
          <span style={textStyleSize}>{` - ${textSize}`}</span>
          {typeHTML}
        </p>
      );
    }

    return textSizeHTML;
  };

  row = (nrow, panesConfig) => {
    this.newKeys(nrow);

    const keysPanelConfig = Object.keys(panesConfig);

    const panesHTML = keysPanelConfig.map((key) =>
      this.isAdderPane(key)
        ? this.paneAdderHtml(key, panesConfig[key], nrow)
        : this.paneHTML(key, panesConfig[key], nrow)
    );

    const { order } = this.state;
    const maxSizeRow = this.maxSizeRow(nrow);

    return (
      <div style={{ height: maxSizeRow, marginBottom: '50px' }} key={getStr()}>
        {this.actionsPanes(nrow)}
        <div key={this.sortablePanelKey[nrow]} ref={this.sortablePanelRef[nrow]}>
          <SortablePane
            direction="horizontal"
            order={order[nrow]}
            onOrderChange={(orderValue) => this.orderChange(nrow, orderValue)}
            onResizeStop={(e, key, dir, ref, d) => this.changeWidth(nrow, key, d)}
          >
            {panesHTML}
          </SortablePane>
        </div>
      </div>
    );
  };

  actionsPanes = (nrow) => {
    const { panes } = this.state;
    const totalPanes = panes.length - 1;

    return (
      <fieldset>
        <div className="cl-element">
          <button
            type="button"
            className="play-btn btn btn-danger"
            style={{ marginRight: '10px' }}
            onClick={() => this.deleteRow(nrow)}
          >
            <i className="fa fa-times-circle" />
            <span> Delete</span>
          </button>
          {nrow !== 0 && (
            <button type="button" className="play-btn btn btn-default" onClick={() => this.rowMoveUp(nrow)}>
              <i className="fa fa-arrow-up" />
              <span> Move up</span>
            </button>
          )}
          {nrow < totalPanes && (
            <button type="button" className="play-btn btn btn-default" onClick={() => this.rowMoveDown(nrow)}>
              <i className="fa fa-arrow-down" />
              <span> Move down</span>
            </button>
          )}
        </div>
      </fieldset>
    );
  };

  renderActionsGeneralPanes = () => {
    return (
      <fieldset>
        <div className="cl-element">
          <button type="button" className="play-btn btn btn-default margin-right-5" onClick={() => this.addRow()}>
            <i className="fa fa-plus" />
            <span> Add row</span>
          </button>
          <button type="button" className="play-btn btn btn-success" onClick={() => this.openSaveModal()}>
            <i className="fa fa-play" />
            <span> Finish</span>
          </button>
        </div>
      </fieldset>
    );
  };

  renderPanes() {
    const { panes } = this.state;

    const panesHTML = [];
    panes.forEach((pane, nrow) => {
      const paneHTML = this.row(nrow, pane);

      panesHTML.push(paneHTML);
    });

    return panesHTML;
  }

  render() {
    return (
      <div className="widget-body" style={{ paddingRight: marginPane, paddingLeft: marginPane }}>
        <div ref={this.bodyRef} />
        {this.renderActionsGeneralPanes()}
        {this.renderPanes()}
        <SaveDashboardModal
          items={[]}
          alias={{}}
          title="Save dashboard"
          show={this.state.showModal}
          onCancel={this.closeSaveModal}
          onSave={this.handleSelectorModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    configDashboard: state.getIn(['configDashboard']),
  };
};

export default connect(mapStateToProps)(ConfigDashboard);
