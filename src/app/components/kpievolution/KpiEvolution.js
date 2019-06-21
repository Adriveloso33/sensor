import React from 'react';
import PropTypes from 'prop-types';

import Select2 from 'react-select2-wrapper';

import { errorMessage } from '../notifications';

import {
  getEntropyCounters,
  getEntropyKpis,
  getKpiEvolutionChart,
  getGeneralNetworkElements,
  getEntropyFamilyLevels,
  getGeneralFilterGroupLevel,
} from '../../requests/entropy';

import { checkAuthError } from '../auth/actions';

import { getParentState, getVendorName } from '../../helpers/GlobalHelper';

import KpisModalWithConfiguration from '../modals/selectors/kpis/KpisModalWithConfiguration';
import CounterSelectorModal from '../modals/selectors/counters/CounterModalWithConfiguration';
import NetworkSelectorModal from '../modals/selectors/network/NetworkSelectorModal';

import store from '../../store/configureStore';
import { initProcess, finishProcess } from '../scheduler/SchedulerActions';

export default class KpiEvolution extends React.Component {
  static contextTypes = {
    parentState: PropTypes.object.isRequired,
    updateParent: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.loadingIcon = 'fa fa-cog fa-spin';
    this.normalIcon = 'fa fa-plus';

    this.pid = getStr();
    this.dropDownId = getStr();

    this.state = {
      // values to show
      familyLevel: null,
      filterLevel: null,
      selectedKpis: [],
      selectedCounters: [],
      customCountersAggregation: {},
      selectedNe: [],
      type: 'KPI',

      // sets of elements
      kpisData: {},
      countersData: {},
      neGrid: {},
      familyLevelsList: [],
      groupLevelsList: [],

      // main filter copy
      filter: {},

      // modal states handlers
      showKpisSelectorModal: false,
      showCountersSelectorModal: false,
      showNeSelectorModal: false,

      // loading state handler
      loading: false,
      loadingRequests: false,
    };

    this.kpisConfig = {};
    this.countersConfig = {};

    this.radioId = getStr();
    this.radioName = `type_${this.radioId}`;
  }

  /* React Lifecycle methods */
  componentDidMount() {
    const { props } = this;

    this.setState({
      ...props,
    });

    const mainFilter = this.getMainFilterState();
    if (mainFilter) this.getData(mainFilter);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext !== this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      if (nextState.mainFilter !== currentState.mainFilter) {
        const filter = nextState.mainFilter;
        this.getData(filter);
      }

      if (nextState.onFilterChange !== currentState.onFilterChange) {
        const filter = nextState.onFilterChange;
        this.getData(filter);
      }
    }
  }

  /* HTTP Requests */
  getData = (filter) => {
    const currentFilter = this.state.filter;
    const nextFilter = _.cloneDeep(filter);

    if (this.isUpdateNeeded(currentFilter, nextFilter)) {
      this.setState(
        {
          filter: _.cloneDeep(nextFilter),
          familyLevel: null,
          filterLevel: null,
          selectedNe: [],
          selectedKpis: [],
          selectedCounters: [],

          kpisData: {},
          countersData: {},
          neGrid: {},
          familyLevelsList: [],
          groupLevelsList: [],
        },
        this.reloadFamilyLevels
      );
    }
  };

  reloadFamilyLevels = () => {
    const mainFilter = this.getMainFilterState() || {};
    const { vendor_id, region_id } = mainFilter || {};

    return new Promise((resolve, reject) => {
      this.startLoadingForBackgroundRequests();
      getEntropyFamilyLevels(vendor_id, region_id)
        .then((familyLevelsList) => {
          this.setState(
            {
              familyLevelsList,
            },
            resolve(familyLevelsList)
          );
          this.finishLoadingForBackgroundRequests();
        })
        .catch((error) => {
          errorMessage('Error', 'Error while retrieving family levels');
          this.setState(
            {
              familyLevelsList: [],
            },
            reject(error)
          );
          this.finishLoadingForBackgroundRequests();
        });
    });
  };

  reloadFilterLevels = () => {
    const mainFilter = this.getMainFilterState() || {};
    const { vendor_id, region_id } = mainFilter || {};
    const { familyLevel } = this.state;

    return new Promise((resolve, reject) => {
      this.startLoadingForBackgroundRequests();
      getGeneralFilterGroupLevel(region_id, vendor_id, familyLevel)
        .then((data) => {
          const groupLevelsList = data.groupLevel;
          this.setState(
            {
              groupLevelsList,
            },
            resolve(groupLevelsList)
          );
          this.finishLoadingForBackgroundRequests();
        })
        .catch((error) => {
          errorMessage('Error', 'Error while retrieving group levels');
          this.setState(
            {
              groupLevelsList: [],
            },
            reject(error)
          );
          this.finishLoadingForBackgroundRequests();
        });
    });
  };

  makeHttpRequests = () => {
    const mainFilter = this.getMainFilterState();
    const { vendor_id, region_id } = mainFilter || {};
    const { familyLevel } = this.state;

    if (!vendor_id || !familyLevel || !region_id) return;

    const tasks = [
      this.reloadFilterLevels(),
      this.getKpisData(vendor_id, familyLevel, region_id),
      this.getCountersData(vendor_id, familyLevel, region_id),
    ];

    Promise.all(tasks)
      .then(() => {})
      .catch(() => {});
  };

  getKpisData = (vendorId, familyLevel, regionId) => {
    return new Promise((resolve, reject) => {
      getEntropyKpis(vendorId, familyLevel, regionId)
        .then((kpisData) => {
          this.setState(
            {
              kpisData,
            },
            () => {
              resolve(true);
            }
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getCountersData = (vendorId, familyLevel, regionId) => {
    return new Promise((resolve, reject) => {
      getEntropyCounters(vendorId, familyLevel, regionId)
        .then((countersData) => {
          this.setState(
            {
              countersData,
            },
            () => {
              resolve(true);
            }
          );
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getNeData = (filter) => {
    if (!filter.filter_level) return Promise.resolve({});

    this.startLoadingForBackgroundRequests();
    return new Promise((resolve, reject) => {
      getGeneralNetworkElements(filter)
        .then((neGrid) => {
          this.setState(
            {
              neGrid,
            },
            () => {
              resolve(true);
              this.finishLoadingForBackgroundRequests();
            }
          );
        })
        .catch((error) => {
          reject(error);
          this.finishLoadingForBackgroundRequests();
        });
    });
  };

  /**
   * Prepare the Kpi Evolution request parameters
   */
  mergeFilterData = () => {
    const { selectedKpis, selectedCounters, customCountersAggregation, filterLevel, selectedNe, type } = this.state;

    const parsedCountersList = this.parseCountersAggregation(selectedCounters, customCountersAggregation);

    const mainFilter = this.getMainFilterState();

    const filter = _.cloneDeep(mainFilter);

    const newFilterItem = { [filterLevel]: selectedNe };
    const newFilter = Object.assign({}, filter.filter, newFilterItem);

    filter.aaKpiCounters = type === 'KPI' ? selectedKpis : parsedCountersList;
    filter.filter = newFilter;
    filter.graphConfig = this.getSeriesConfig();

    return filter;
  };

  getMainFilterState = () => {
    const { getFilterInternalState } = getParentState(this);
    let filter = {};

    if (typeof getFilterInternalState === 'function') filter = getFilterInternalState();

    return filter;
  };

  getLevelName = (level_id) => {
    let levelName = '';
    const levels = this.state.groupLevelsList;

    let l = levels && levels.find((elem) => elem.id == level_id);
    levelName = l ? l.text : '';

    return levelName;
  };

  getNeName = (ne_id) => {
    let neName = '';
    const { neList } = this.state || {};

    let ne = neList && neList.find((elem) => elem.id == ne_id);
    neName = ne ? ne.text : '';

    return neName;
  };

  setCounterAggregation = (counterId, aggLevel) => {
    const indexOfComa = counterId.indexOf(',');

    const counterSuffix = counterId.substring(indexOfComa);

    const counterNewPrefix = `C#${aggLevel}`;

    const newCounterId = `${counterNewPrefix}${counterSuffix}`;

    return newCounterId;
  };

  parseCountersAggregation(selectedCounters = [], countersAggregation = {}) {
    const newCounters = selectedCounters.map((counterId) => {
      if (countersAggregation[counterId]) {
        const aggLevel = countersAggregation[counterId];

        const newCounterId = this.setCounterAggregation(counterId, aggLevel);

        return newCounterId;
      }

      return counterId;
    });

    return newCounters;
  }

  parseSeriesNames = (data = [], alias = {}) => {
    data.forEach((serie) => {
      const { name } = serie;
      const newName = name && alias[name] ? alias[name] : name;

      serie.name = newName;
    });

    return data;
  };

  getNeSerieSuffixText = (selectedNe, levelName) => {
    let neText = '';

    if (levelName === 'NET') return levelName;

    neText = selectedNe.length === 1 ? selectedNe[0] : `${selectedNe.length}_${levelName}`;

    return neText;
  };

  getSerieFinalName = (serie) => {
    const { filterLevel, selectedNe } = this.state || {};
    const { mainFilter } = getParentState(this) || {};

    const mainFilterState = this.getMainFilterState(),
      levelName = this.getLevelName(filterLevel),
      neText = this.getNeSerieSuffixText(selectedNe, levelName);

    let finalName = '';

    if (mainFilterState.vendor_id !== mainFilter.vendor_id) {
      const vendorName = getVendorName(this, mainFilterState.vendor_id);

      finalName = `${serie.name}_${vendorName}_${neText}`;
    } else {
      finalName = `${serie.name}_${neText}`;
    }

    return finalName;
  };

  parseSerieData = (series) => {
    const parsedSeries = this.parseSeriesNames(series.data, series.alias) || [];

    parsedSeries.forEach((serie) => {
      serie.name = this.getSerieFinalName(serie);
    });

    return parsedSeries;
  };

  exportKpiEvolution = (filter, cb) => {
    this.startLoading();
    getKpiEvolutionChart(filter)
      .then((series) => {
        const seriesData = this.parseSerieData(series);
        if (typeof cb === 'function') {
          cb(seriesData);
        } else {
          this.genericExport(seriesData);
        }
        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        if (!checkAuthError(err)) errorMessage('Error', 'Error while retrieving KPI evolution graph data');
      });
  };

  genericExport = (series) => {
    this.context.updateParent({
      graphSerieData: series,
    });
  };

  /* Handlers */
  handleChanges = (event) => {
    const element = event.target;
    const value = element.value;
    const name = element.name;

    const field = name.replace(`_${this.radioId}`, '');

    const { familyLevel, filterLevel } = this.state;

    this.setState(
      {
        [field]: value,
      },
      () => {
        this.checkForFamilyLevelChanges(familyLevel, this.state.familyLevel);
        this.checkForFilterLevelChanges(filterLevel, this.state.filterLevel);
      }
    );
  };

  checkForFamilyLevelChanges = (oldValue, currentValue) => {
    if (oldValue !== currentValue) {
      this.setState(
        {
          filterLevel: null,
          selectedNe: [],
          selectedKpis: [],
          selectedCounters: [],

          kpisData: {},
          countersData: {},
          neGrid: {},
          groupLevelsList: [],
        },
        this.makeHttpRequests
      );
    }
  };

  checkForFilterLevelChanges = (oldValue, currentValue) => {
    if (oldValue !== currentValue) {
      this.clearNeList();

      const customFilterForNe = this.getFilterForNE();
      this.getNeData(customFilterForNe)
        .then(() => {})
        .catch(() => {});
    }
  };

  handleClickBtn = () => {
    try {
      this.validateUserSelection();
    } catch (Exception) {
      errorMessage('Error', Exception);
      return;
    }

    const filter = this.mergeFilterData();
    const { onClick } = this.props;
    this.exportKpiEvolution(filter, onClick);
  };

  validateUserSelection = () => {
    if (!this.state.familyLevel) throw 'Please select the Family Level.';
    if (!this.state.filterLevel) throw 'Please select the Group Level.';

    if (this.state.filterLevel !== 'NET' && !this.state.selectedNe.length) throw 'Please select the Network Elements.';

    const hasSelectededKpiOrCounters =
      this.state.type === 'KPI' ? this.state.selectedKpis.length : this.state.selectedCounters.length;
    if (!hasSelectededKpiOrCounters) throw 'Please select the Kpis or Counters.';
  };

  handleSelectorModal = (modalName = 'none', show = false) => {
    this.setState({
      [modalName]: show,
    });
  };

  handleSaveKpisSelector = (selectedKpis) => {
    this.handleSelectorModal('showKpisSelectorModal', false);

    this.setState({
      selectedKpis: selectedKpis,
    });
  };

  handleSaveCountersSelector = (selectedCounters = [], customCountersAggregation = {}) => {
    this.handleSelectorModal('showCountersSelectorModal', false);

    this.setState({
      selectedCounters,
      customCountersAggregation,
    });
  };

  handleSaveNeSelector = (selectedNe) => {
    this.handleSelectorModal('showNeSelectorModal', false);

    this.setState({
      selectedNe,
    });
  };

  handleKpisConfigSave = (kpisConfig) => {
    this.kpisConfig = kpisConfig;
  };

  handleCountersConfigSave = (countersConfig) => {
    this.countersConfig = countersConfig;
  };

  isUpdateNeeded = (currentFilter, nextFilter) => {
    const { vendor_id, region_id } = currentFilter;

    const filterHasChanged = vendor_id !== nextFilter.vendor_id || region_id !== nextFilter.region_id;

    return filterHasChanged;
  };

  clearNeList = () => {
    this.setState({
      allNe: [],
      selectedNe: [],
    });
  };

  getRegionName = (region_id) => {
    const { regionList } = getParentState(this);
    let name = '';

    regionList &&
      regionList.forEach((elem) => {
        elem.id == region_id && (name = elem.name);
      });

    return name;
  };

  getVendorAndFamily = () => {
    const mainFilter = this.getMainFilterState();

    const { vendor_id } = mainFilter || {};

    return {
      vendorId: vendor_id,
      familyLevel: this.state.familyLevel,
    };
  };

  getFilterForNE = () => {
    const mainFilter = this.getMainFilterState() || {};

    const filterForNe = {
      vendor_id: mainFilter.vendor_id,
      region_id: mainFilter.region_id,
      family_level: this.state.familyLevel,
      filter_level: this.state.filterLevel,
    };

    return filterForNe;
  };

  getSeriesConfig = () => {
    const { kpisConfig, countersConfig } = this;

    const kpisConfigArray = this.configToArray(kpisConfig);
    const countersConfigArray = this.configToArray(countersConfig);

    return [
      {
        title: '',
        series: kpisConfigArray.concat(countersConfigArray),
      },
    ];
  };

  configToArray = (config) => {
    const configArray = Object.keys(config).map((id) => {
      const configItem = config[id];

      const parsedConfig = {
        ...configItem,
        id,
      };

      return parsedConfig;
    });

    return configArray;
  };

  startLoading = () => {
    store.dispatch(initProcess(this.pid));
    this.setState({
      loading: true,
    });
  };

  finishLoading = () => {
    store.dispatch(finishProcess(this.pid));
    this.setState({
      loading: false,
    });
  };

  startLoadingForBackgroundRequests = () => {
    this.setState({
      loadingRequests: true,
    });
  };

  finishLoadingForBackgroundRequests = () => {
    this.setState({
      loadingRequests: false,
    });
  };

  render() {
    const {
      familyLevel,
      familyLevelsList,
      filterLevel,
      groupLevelsList,
      type,
      loading,
      loadingRequests,
      selectedKpis,
      selectedCounters,
      selectedNe,
    } = this.state;

    const infoSelectCounter = type === 'KPI' ? selectedKpis.length : selectedCounters.length;
    const infoSelectType = type === 'KPI' ? 'kpis' : 'counters';
    const infoSelectText = `Selected ${infoSelectCounter} ${infoSelectType}`;

    const neInfoSelectCounter = selectedNe.length;
    const classForSelectionButtons = loadingRequests === false ? 'fa fa-search' : 'fa fa-cog fa-spin';

    return (
      <div className="kpi-evolution">
        <div className="cl-element">
          <Select2
            name={'familyLevel'}
            style={{ width: '100%' }}
            data={familyLevelsList || []}
            value={familyLevel ? [familyLevel] : []}
            options={{
              disabled: loadingRequests == true,
              placeholder: loadingRequests == true ? 'Loading' : 'Select Family Level',
            }}
            onSelect={this.handleChanges}
            onUnselect={this.handleChanges}
          />
        </div>

        <div className="cl-element">
          <Select2
            name={'filterLevel'}
            style={{ width: '100%' }}
            data={groupLevelsList || []}
            value={filterLevel ? [filterLevel] : []}
            options={{
              disabled: loadingRequests == true,
              placeholder: loadingRequests == true ? 'Loading' : 'Select Filter Level',
            }}
            onSelect={this.handleChanges}
            onUnselect={this.handleChanges}
          />
        </div>

        <div className="cl-element btn-select2-addon">
          <Select2
            name={'ne'}
            style={{ width: '100%' }}
            options={{
              disabled: true,
              placeholder: `Selected ${neInfoSelectCounter} elements`,
            }}
          />
          <button
            className="btn btn-default"
            data-toggle="tooltip"
            data-placement="top"
            disabled={!filterLevel || filterLevel === 'NET' || loadingRequests == true}
            onClick={() => {
              const modalName = 'showNeSelectorModal';
              this.handleSelectorModal(modalName, true);
            }}
          >
            <i className={classForSelectionButtons} />
          </button>
        </div>

        <div className="cl-element">
          <div className="row">
            <div className="col-sm-12">
              <fieldset>
                <label className="radio-inline">
                  <input
                    type="radio"
                    name={this.radioName}
                    value="KPI"
                    checked={type == 'KPI'}
                    onChange={this.handleChanges}
                  />
                  KPI
                </label>
                <label className="radio-inline">
                  <input
                    type="radio"
                    name={this.radioName}
                    value="COUNTER"
                    checked={type == 'COUNTER'}
                    onChange={this.handleChanges}
                  />
                  Counter
                </label>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="cl-element btn-select2-addon">
          <Select2 style={{ width: '100%' }} options={{ disabled: true, placeholder: infoSelectText }} />
          <button
            className="btn btn-default"
            data-toggle="tooltip"
            data-placement="top"
            disabled={loadingRequests == true}
            onClick={() => {
              const modalName = type == 'KPI' ? 'showKpisSelectorModal' : 'showCountersSelectorModal';
              this.handleSelectorModal(modalName, true);
            }}
          >
            <i className={classForSelectionButtons} />
          </button>
        </div>

        <div className="cl-element">
          <button type="button" className="play-btn btn btn-default" onClick={this.handleClickBtn}>
            <i className={!loading ? this.normalIcon : this.loadingIcon} />
            <span> Add to Graph</span>
          </button>
        </div>
        {/* Modals */}

        {/* KPI Modal instance */}
        <KpisModalWithConfiguration
          showConfiguration
          data={this.state.kpisData}
          selectedItems={this.state.selectedKpis}
          title="KPI Selector"
          show={this.state.showKpisSelectorModal}
          onCancel={this.handleSelectorModal.bind(this, 'showKpisSelectorModal', false)}
          onSave={this.handleSaveKpisSelector}
          kpisConfig={this.kpisConfig}
          onConfigSave={this.handleKpisConfigSave}
        />

        {/* Counters Modal instance */}
        <CounterSelectorModal
          showConfiguration
          data={this.state.countersData}
          selectedItems={this.state.selectedCounters}
          customCountersAggregation={this.state.customCountersAggregation}
          title="Counters Selector"
          show={this.state.showCountersSelectorModal}
          onCancel={this.handleSelectorModal.bind(this, 'showCountersSelectorModal', false)}
          onSave={this.handleSaveCountersSelector}
          countersConfig={this.countersConfig}
          onConfigSave={this.handleCountersConfigSave}
        />

        {/* NE Modal instance */}
        <NetworkSelectorModal
          items={this.state.neGrid.data || []}
          alias={this.state.neGrid.alias || {}}
          selectedItems={this.state.selectedNe}
          title="Network Elements Selector"
          show={this.state.showNeSelectorModal}
          onCancel={this.handleSelectorModal.bind(this, 'showNeSelectorModal', false)}
          onSave={this.handleSaveNeSelector}
        />
      </div>
    );
  }
}
