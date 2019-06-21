import React from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';

import { warningMessage } from '../../../components/notifications';

import { getGeneralNetworkElements } from '../../../requests/entropy';
import { getKpisByReport } from '../../../requests/entropy/dashboards';

import { getParentState } from '../../../helpers/GlobalHelper';

import NetworkSelectorModal from '../../../components/modals/selectors/network/NetworkSelectorModal';
import TroubleshootingContainer from '../containers/Troubleshooting';

import { addTab } from '../../../components/tabs/TabsActions';

export default class Troubleshooting extends React.Component {
  constructor(props) {
    super(props);

    this.loadingIcon = 'fa fa-cog fa-spin';
    this.normalIcon = 'fa fa-plus';

    this.state = {
      // values to show
      level: null,
      selectedNe: [],

      // sets of elements
      neGrid: {},
      allGroupLevels: false,
      kpiList: [],

      // main filter copy
      filter: {},

      // modal states handlers
      showNeSelectorModal: false,

      report: 'TROUBLESHOOTING',

      // loading state handler
      loading: false,
      loadingRequests: false,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    const { props } = this;

    this.setState({
      ...props,
    });

    const { mainFilter } = getParentState(this) || {};
    if (mainFilter) this.getData(mainFilter);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      let nextState = nextContext.parentState || {};
      let currentState = this.context.parentState || {};

      if (nextState.mainFilter != currentState.mainFilter) {
        const filter = nextState.mainFilter;
        this.getData(filter);
      }

      if (nextState.onFilterChange != currentState.onFilterChange) {
        const filter = nextState.onFilterChange;
        this.getData(filter);
      }
    }
  }

  /* HTTP Requests */
  getData = (filter) => {
    const currFilter = this.state.filter;
    const nextFilter = _.cloneDeep(filter);

    if (this.isUpdateNeeded(currFilter, nextFilter)) {
      this.setState(
        {
          filter: _.cloneDeep(nextFilter),
          selectedNe: [],
        },
        this.makeAllHttpRequests
      );
    }
  };

  makeAllHttpRequests = () => {
    const customFilterForNe = this.getFilterForNE();

    const tasks = [this.getNeData(customFilterForNe), this.getKpisForReport()];

    Promise.all(tasks)
      .then((values) => {})
      .catch((error) => {});
  };

  getNeData = (filter) => {
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

  getKpisForReport = () => {
    const { report } = this.state;
    const { vendor_id } = this.state.filter || {};

    return new Promise((resolve, reject) => {
      getKpisByReport(vendor_id, report)
        .then((data) => {
          this.setState({
            kpiList: data,
          });

          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  getMainFilterState = () => {
    const { getFilterInternalState } = getParentState(this);
    let filter = {};

    if (typeof getFilterInternalState === 'function') filter = getFilterInternalState();

    return filter;
  };

  /* Handlers */
  handleChanges = (event) => {
    const element = event.target;
    const value = element.value;
    const name = element.name;

    const { level } = this.state || {};

    this.setState(
      {
        [name]: value,
      },
      () => {
        if (level != this.state.level) {
          this.clearNeList();

          this.reloadNeList();
        }
      }
    );
  };

  handleClickBtn = () => {
    const { level, selectedNe } = this.state || {};

    if (!level) {
      warningMessage('Error', 'Please select the Group Level.');
      return;
    }

    if (level !== 'NET' && !selectedNe.length) {
      warningMessage('Error', 'Please select the Network Elements.');
      return;
    }

    this.loadTroubleshootingDashboard();
  };

  loadTroubleshootingDashboard = () => {
    const mainFilterState = this.getTroubleshootingFilter();
    const tabData = {
      active: true,
      title: 'Troubleshooting',
      component: TroubleshootingContainer,
      props: {
        filter: mainFilterState,
      },
    };

    store.dispatch(addTab(tabData));
  };

  getTroubleshootingFilter = () => {
    const mainFilter = _.cloneDeep(this.getMainFilterState());

    const { level, selectedNe } = this.state;
    mainFilter.filter = {
      [level]: selectedNe,
    };

    mainFilter.groupLevel1 = level;

    return mainFilter;
  };

  handleSelectorModal = (modalName = 'none', show = false) => {
    this.setState({
      [modalName]: show,
    });
  };

  handleSaveNeSelector = (selectedNe) => {
    this.handleSelectorModal('showNeSelectorModal', false);

    this.setState({
      selectedNe,
    });
  };

  /* Utils */
  /**
   * Returns true if the HTTP request needs to be done due the nextFilter has
   * a vendor o .filter config different from the currentFilter
   */
  isUpdateNeeded = (currentFilter, nextFilter) => {
    const isVendorChanged = currentFilter.vendor_id !== nextFilter.vendor_id;
    const isRegionChanged = currentFilter.region_id !== nextFilter.region_id;

    return isVendorChanged || isRegionChanged;
  };

  reloadNeList() {
    const customFilterForNe = this.getFilterForNE();
    this.getNeData(customFilterForNe)
      .then(() => {})
      .catch(() => {});
  }

  clearNeList = () => {
    this.setState({
      neGrid: {},
      selectedNe: [],
    });
  };

  getGroupLevels = () => {
    const parentState = getParentState(this);
    const { groupLevel1 } = parentState || {};

    return groupLevel1 || [];
  };

  getParsedGroupLevels = () => {
    const groupLevels = this.getGroupLevels();

    const groupLevelsWithoutNet = groupLevels.filter((elem) => elem.text !== 'NET' && elem.text !== 'REGION');

    return groupLevelsWithoutNet;
  };

  getFilterForNE = () => {
    const mainFilter = this.getMainFilterState();
    const level = this.state.level || (mainFilter ? mainFilter.groupLevel1 : '');

    const filter = {
      vendor_id: mainFilter.vendor_id,
      region_id: mainFilter.region_id,
      filter_level: level,
      family_level: mainFilter.family_level,
    };

    return filter;
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
    const { level, selectedNe, loadingRequests } = this.state;

    const groupLevel1 = this.getParsedGroupLevels();

    const neInfoSelectCounter = selectedNe.length;
    const classForSelectionButtons = loadingRequests === false ? 'fa fa-search' : 'fa fa-cog fa-spin';

    return (
      <div className="kpi-evolution">
        <div className="cl-element">
          <Select2
            name={'level'}
            style={{ width: '100%' }}
            data={groupLevel1 || []}
            value={level ? [level] : []}
            options={{
              placeholder: 'Select Filter Level',
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
            disabled={!level || level === 'NET' || loadingRequests === true}
            onClick={() => {
              const modalName = 'showNeSelectorModal';
              this.handleSelectorModal(modalName, true);
            }}
          >
            <i className={classForSelectionButtons} />
          </button>
        </div>

        <div className="cl-element">
          <button type="button" className="play-btn btn btn-default" onClick={this.handleClickBtn}>
            <i className={'fa fa-play'} />
            <span> {'New Tab'}</span>
          </button>
        </div>
        {/* Modals */}

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

Troubleshooting.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
