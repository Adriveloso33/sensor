import React from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';

import Switch from 'react-switch';
import KpisModalWithConfiguration from '../../../../../../components/modals/selectors/kpis/KpisModalWithConfiguration';
import CounterSelectorModal from '../../../../../../components/modals/selectors/counters/CounterModalWithConfiguration';

import { getEntropyKpis, getEntropyCounters, getEntropyFamilyLevelId } from '../../../../../../requests/entropy';
import { getKpisForSpecialEvent } from '../../../../requests';

import WdnaColors from '../../../../../../helpers/HighChartColors';

const specialEventsFamilyName = 'CELL LEVEL';
const defaultSerieConfig = {
  yAxis: 0,
  color: '#008aad',
  type: 'spline',
};

export default class InlineKpiSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'KPI',
      selectedKpis: [],
      selectedCounters: [],

      markSpecialEventsKpis: true,
      specialEventKpiList: [],

      familyLevelId: null,
      loadingRequests: false,

      showKpisSelectorModal: false,
      showCountersSelectorModal: false,

      kpisData: {
        data: [],
        alias_grid: {},
      },
      countersData: {
        data: [],
        alias_grid: {},
      },
      customCountersAggregation: {},
    };

    this.kpisConfig = {};
    this.countersConfig = {};

    this.radioId = getStr();
    this.radioName = `type_${this.radioId}`;
  }

  /* React Lifecycle methods */
  componentDidMount() {
    this.initializeData();
  }

  initializeData = () => {
    this.loadFamilyLevelId(this.loadKpisAndCounters);
    this.loadKpisForSpecialEvent();
  };

  getMainFilterState = () => {
    return this.props.mainFilter;
  };

  loadFamilyLevelId = (cb) => {
    const { vendor } = this.props.mainFilter || {};

    getEntropyFamilyLevelId(vendor, specialEventsFamilyName)
      .then((familyLevelId) => {
        this.setState(
          {
            familyLevelId,
          },
          cb
        );
      })
      .catch((err) => {});
  };

  loadKpisAndCounters = () => {
    this.loadAllKpis();
    this.loadAllCounters();
  };

  loadAllKpis = () => {
    const { familyLevelId } = this.state;
    const { vendor_id, region_id } = this.props.mainFilter || {};

    this.startLoadingForBackgroundRequests();
    getEntropyKpis(vendor_id, familyLevelId, region_id)
      .then((kpisData) => {
        this.setState({
          kpisData,
        });
        this.finishLoadingForBackgroundRequests();
      })
      .catch((err) => {
        this.finishLoadingForBackgroundRequests();
      });
  };

  loadAllCounters = () => {
    const { familyLevelId } = this.state;
    const { vendor_id, region_id } = this.props.mainFilter || {};

    this.startLoadingForBackgroundRequests();
    getEntropyCounters(vendor_id, familyLevelId, region_id)
      .then((countersData) => {
        this.setState({
          countersData,
        });
        this.finishLoadingForBackgroundRequests();
      })
      .catch((err) => {
        this.finishLoadingForBackgroundRequests();
      });
  };

  loadKpisForSpecialEvent = () => {
    const { vendor } = this.props.mainFilter || {};

    this.startLoadingForBackgroundRequests();
    getKpisForSpecialEvent(vendor)
      .then((specialEventKpiListRaw) => {
        const specialEventKpiList = this.parsedKpiList(specialEventKpiListRaw);

        this.kpisConfig = this.makeInitialKpisConfig(specialEventKpiList);
        this.setState(
          {
            specialEventKpiList,
          },
          this.saveFilterData
        );

        this.finishLoadingForBackgroundRequests();
      })
      .catch((err) => {
        this.finishLoadingForBackgroundRequests();
      });
  };

  makeInitialKpisConfig = (initialKpiList = []) => {
    const kpisConfig = {};
    const limit = WdnaColors.length;

    initialKpiList.forEach((kpiId, index) => {
      kpisConfig[kpiId] = {
        ...defaultSerieConfig,
        color: WdnaColors[index % limit],
      };
    });

    return kpisConfig;
  };

  parsedKpiList = (rawList = []) => {
    return rawList.map((kpiInfo) => kpiInfo.id);
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

  setCounterAggregation = (counterId, aggLevel) => {
    const indexOfComa = counterId.indexOf(',');

    const counterSuffix = counterId.substring(indexOfComa);

    const counterNewPrefix = `C#${aggLevel}`;

    const newCounterId = `${counterNewPrefix}${counterSuffix}`;

    return newCounterId;
  };

  saveFilterData = () => {
    const mainFilter = this.getMainFilterState();
    const newMainFilter = _.cloneDeep(mainFilter);

    const { selectedKpis, selectedCounters, customCountersAggregation } = this.state;
    const parsedCountersList = this.parseCountersAggregation(selectedCounters, customCountersAggregation);
    newMainFilter.aaKpiCounters = selectedKpis.concat(parsedCountersList);

    const { kpisConfig, countersConfig } = this;
    newMainFilter.kpisConfig = this.cleanConfigFromList(kpisConfig, selectedKpis);
    newMainFilter.countersConfig = this.cleanConfigFromList(countersConfig, selectedCounters);

    this.context.updateParent({ silentFilterUpdate: newMainFilter });
  };

  cleanConfigFromList = (config = {}, selectedItems = []) => {
    const cleanedConfig = {};

    selectedItems.forEach((itemId) => {
      cleanedConfig[itemId] = _.cloneDeep(config[itemId]);
    });

    return cleanedConfig;
  };

  filterKpiList = (kpiInfo = {}) => {
    if (!this.state.markSpecialEventsKpis) return true;

    const { specialEventKpiList = [] } = this.state;
    const isSpecialKpi = specialEventKpiList.find((kpiId) => kpiInfo['COL_1'] === kpiId) != null;

    return isSpecialKpi;
  };

  /* Handlers */
  handleChanges = (e) => {
    const { target } = e;
    const { name } = target;
    const { value } = target;

    const field = name.replace(`_${this.radioId}`, '');

    this.setState(
      {
        [field]: value,
      },
      this.saveFilterData
    );
  };

  handleSwitch = (markSpecialEventsKpis) => {
    this.setState(
      {
        markSpecialEventsKpis,
        selectedKpis: markSpecialEventsKpis ? [] : this.state.selectedKpis,
        selectedCounters: markSpecialEventsKpis ? [] : this.state.selectedCounters,
      },
      this.saveFilterData
    );
  };

  handleNeModalShow = () => {
    this.setState({
      showNeSelectorModal: true,
    });
  };

  handleNeModalCancel = () => {
    this.setState({
      showNeSelectorModal: false,
    });
  };

  handleSelectorModal = (modalName = 'none', show = false) => {
    this.setState({
      [modalName]: show,
    });
  };

  handleSaveCountersSelector = (selectedCounters = [], customCountersAggregation = {}) => {
    this.handleSelectorModal('showCountersSelectorModal', false);

    this.setState(
      {
        selectedCounters,
        customCountersAggregation,
      },
      this.saveFilterData
    );
  };

  handleSaveKpisSelector = (selectedKpis) => {
    this.handleSelectorModal('showKpisSelectorModal', false);

    this.setState(
      {
        selectedKpis: selectedKpis,
      },
      this.saveFilterData
    );
  };

  handleKpisConfigSave = (kpisConfig) => {
    this.kpisConfig = kpisConfig;
  };

  handleCountersConfigSave = (countersConfig) => {
    this.countersConfig = countersConfig;
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
    const { type, loadingRequests, selectedKpis, selectedCounters, markSpecialEventsKpis } = this.state;
    const { type: graphType } = this.props.mainFilter || {};
    const { kpisData = {} } = this.state;
    const infoSelectText = `Selected ${selectedKpis.length} kpis,  ${selectedCounters.length} counters`;
    const classForSelectionButtons = loadingRequests === false ? 'fa fa-search' : 'fa fa-cog fa-spin';

    return (
      <div className="advanced-filter" style={{ display: 'block' }}>
        <div className="cl-element">
          <div className="row graph-section-special-events">
            <div className="col-sm-12">
              <fieldset>
                <h3>Graph elements</h3>
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
        <div className="cl-element" style={{ width: '100%' }}>
          <label htmlFor="normal-switch">
            <Switch
              className="react-switch"
              onChange={this.handleSwitch}
              checked={markSpecialEventsKpis}
              aria-labelledby="neat-label"
              id="share"
              height={30}
              offColor="#5c6875"
              onColor="#0f610f"
            />
            <span>Set Special Event KPIs</span>
          </label>
        </div>

        {/* KPI Modal instance */}
        <KpisModalWithConfiguration
          showConfiguration
          showColorPicker={graphType !== 'multi'}
          data={{
            ...kpisData,
            data: this.state.kpisData.data.filter(this.filterKpiList),
          }}
          maxElements={25}
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
          showColorPicker={graphType !== 'multi'}
          data={this.state.countersData}
          maxElements={25}
          selectedItems={this.state.selectedCounters}
          customCountersAggregation={this.state.customCountersAggregation}
          title="Counters Selector"
          show={this.state.showCountersSelectorModal}
          onCancel={this.handleSelectorModal.bind(this, 'showCountersSelectorModal', false)}
          onSave={this.handleSaveCountersSelector}
          countersConfig={this.countersConfig}
          onConfigSave={this.handleCountersConfigSave}
        />
      </div>
    );
  }
}

InlineKpiSelector.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
