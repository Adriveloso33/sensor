import React from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';

import KpiSelectorModal from '../../../../../components/modals/selectors/kpis/KpisModalWithConfiguration';
import KpiToCountersContainer from '../../../containers/KpiToCounters';

import { getParentState } from '../../../../../helpers/GlobalHelper';
import { createTab } from '../../../../../helpers/TabsHelper';
import { cleanFilter } from '../../../../../helpers/FilterHelper';
import { errorMessage } from '../../../../../components/notifications';

const requiredParams = [
  'arrFilterDate',
  'groupDateTime',
  'vendor',
  'vendor_id',
  'region_id',
  'id_event',
  'event_ne_type',
  'groupLevel1',
];

const optionalParams = ['arrFilterNe', 'aaKpiCounters'];

export default class KpiToCounters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedKpis: [],
      specialEventKpiList: [],

      loadingRequests: false,
      showKpisSelectorModal: false,

      kpisData: {},
      sourceType: 'table',
    };
  }

  getMainFilterState = () => {
    try {
      return this.context.parentState.getFilterInternalState();
    } catch (Ex) {
      return {};
    }
  };

  filterKpiList = (kpiInfo = {}) => {
    const mainFilter = this.getMainFilterState();
    const { aaKpiCounters } = mainFilter || {};
    if (!aaKpiCounters) return false;

    const isSelectedByUser = aaKpiCounters.find((kpiId) => kpiInfo['COL_1'] === kpiId) != null;
    return isSelectedByUser;
  };

  getKpiToCountersFilter = () => {
    const mainFilter = this.getMainFilterState();

    const cleanedFilter = cleanFilter(mainFilter, requiredParams.concat(optionalParams));
    cleanedFilter.aaKpiCounters = this.state.selectedKpis;
    cleanedFilter.drilldown = true;

    return cleanedFilter;
  };

  /* Handlers */
  handleChanges = (e) => {
    const { target } = e;
    const { name } = target;
    const { value } = target;

    this.setState(
      {
        [name]: value,
      },
      this.saveFilterData
    );
  };

  handleSelectorModal = (modalName = 'none', show = false) => {
    this.setState({
      [modalName]: show,
    });
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

  handleClickBtn = () => {
    try {
      this.validateData();
    } catch (Ex) {
      errorMessage('Error', Ex);
      return;
    }

    const tabInfo = {
      active: true,
      component: KpiToCountersContainer,
      props: {
        mainFilter: this.getKpiToCountersFilter(),
      },
      title: 'KPI to Counters',
    };
    createTab(tabInfo, false);
  };

  validateData = () => {
    const mainFilter = this.getMainFilterState();

    if (!mainFilter.groupLevel1) throw 'Please select a valid group level';
    if (!this.state.selectedKpis || this.state.selectedKpis.length === 0) throw 'Please select some KPIs';
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
    const { loadingRequests, selectedKpis } = this.state;

    const infoSelectText = `Selected ${selectedKpis.length} kpis`;
    const classForSelectionButtons = loadingRequests === false ? 'fa fa-search' : 'fa fa-cog fa-spin';

    const { kpisData = {} } = getParentState(this);

    return (
      <div className="advanced-filter" style={{ display: 'block', width: '100%' }}>
        <div className="cl-element btn-select2-addon">
          <Select2 style={{ width: '100%' }} options={{ disabled: true, placeholder: infoSelectText }} />
          <button
            className="btn btn-default"
            data-toggle="tooltip"
            data-placement="top"
            disabled={loadingRequests == true}
            onClick={() => {
              const modalName = 'showKpisSelectorModal';
              this.handleSelectorModal(modalName, true);
            }}
          >
            <i className={classForSelectionButtons} />
          </button>
        </div>
        <div className="cl-element">
          <button type="button" className="play-btn btn btn-default" onClick={this.handleClickBtn}>
            <i className={'fa fa-play'} />
            <span> New Tab</span>
          </button>
        </div>

        {/* KPI Modal instance */}
        <KpiSelectorModal
          showConfiguration={false}
          data={{
            ...kpisData,
            data: kpisData.data ? kpisData.data.filter(this.filterKpiList) : [],
          }}
          maxElements={25}
          selectedItems={this.state.selectedKpis}
          title="KPI Selector"
          show={this.state.showKpisSelectorModal}
          onCancel={this.handleSelectorModal.bind(this, 'showKpisSelectorModal', false)}
          onSave={this.handleSaveKpisSelector}
        />
      </div>
    );
  }
}

KpiToCounters.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
