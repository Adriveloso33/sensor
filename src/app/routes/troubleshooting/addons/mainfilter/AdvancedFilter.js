import React from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';
import NetworkSelectorModal from '../../../../components/modals/selectors/network/NetworkSelectorModal';

import { getGeneralNetworkElements } from '../../../../requests/entropy';

import { getParentState } from '../../../../helpers/GlobalHelper';

export default class AdvancedFilter extends React.Component {
  constructor(props) {
    super(props);

    this.fristRender = true;

    this.state = {
      showNeSelectorModal: false,
      filter: {},

      level: null,
      selectedNe: [],

      neGrid: {},
      loadingRequests: false,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    const { mainFilter } = this.props;
    this.getData(mainFilter);

    const { filter } = this.props.mainFilter;
    if (filter) this.setFilterData(filter);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};
      const { showAdvancedFilter } = nextState || {};

      /* show filter */
      if (showAdvancedFilter === true) {
        this.showAdvancedFilter();
      } else {
        this.hideAdvancedFilter();
      }

      if (nextState.onFilterChange != currentState.onFilterChange) {
        const currentFilter = currentState.onFilterChange;
        const nextFilter = nextState.onFilterChange;

        if (this.isUpdateNeeded(currentFilter, nextFilter)) {
          this.clearFilter();
          this.getData(nextFilter);
        }
      }
    }
  }

  getData = (filter) => {
    const nextFilter = _.cloneDeep(filter);

    this.setState(
      {
        filter: nextFilter,
      },
      () => {
        this.saveFilterData();
        this.reloadNeList();
      }
    );
  };

  reloadNeList = () => {
    this.setState(
      {
        neGrid: {},
      },
      () => {
        const customFilterForNe = this.getFilterForNE();

        this.getNeData(customFilterForNe)
          .then(() => {})
          .catch(() => {});
      }
    );
  };

  /* HTML Request */
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
              this.finishLoadingForBackgroundRequests();
              resolve(true);
            }
          );
        })
        .catch((error) => {
          this.finishLoadingForBackgroundRequests();
          reject(error);
        });
    });
  };

  /* Utils */

  setFilterData = (filters) => {
    if (filters) {
      let keyList = Object.keys(filters);

      if (keyList && keyList.length) {
        let key = keyList[0];
        let values = filters[key];

        if (key != 'NET') {
          this.setState({
            level: key,
            selectedNe: values,
          });
        }
      }
    }
  };

  /**
   * Returns true if the HTTP request needs to be done due the nextFilter has
   * a vendor or region different
   */
  isUpdateNeeded = (currentFilter, nextFilter) => {
    if (!currentFilter || !nextFilter) return false;
    const { vendor_id, region_id } = currentFilter;

    if (vendor_id !== nextFilter.vendor_id || region_id !== nextFilter.region_id) {
      return true;
    }

    return false;
  };

  /* Handle advanced filter slide */
  showAdvancedFilter = () => {
    const $el = $(this.refs.el);
    $el.slideDown();
  };

  hideAdvancedFilter = () => {
    const $el = $(this.refs.el);
    $el.slideUp();
  };

  clearFilter = () => {
    this.setState(
      {
        level: null,
        selectedNe: [],
        neGrid: {},
      },
      this.saveFilterData
    );
  };

  clearNeList = () => {
    this.setState(
      {
        selectedNe: [],
      },
      this.saveFilterData
    );
  };

  getFilterForNE = () => {
    const { level: filter_level } = this.state;
    const mainFilter = this.getMainFilter();

    const { vendor_id, region_id, family_level } = mainFilter || {};

    const filterForNe = {
      vendor_id,
      region_id,
      family_level,
      filter_level,
    };

    return filterForNe;
  };

  getRegionName = (region_id) => {
    let { regionList } = getParentState(this);
    let name = '';

    regionList &&
      regionList.forEach((elem) => {
        if (elem.id === region_id) name = elem.text;
      });

    return name;
  };

  getMainFilterState = () => {
    const { getFilterInternalState } = getParentState(this);
    let filter = {};

    if (typeof getFilterInternalState === 'function') filter = getFilterInternalState();

    return filter;
  };

  getMainFilter = () => {
    return this.getMainFilterState();
  };

  getFilterLevels = () => {
    const { filterLevels } = getParentState(this) || {};

    return filterLevels || [];
  };

  getParsedGroupLevels = () => {
    const groupLevels = this.getFilterLevels();

    const groupLevelsWithoutNet = groupLevels.filter((elem) => elem.text !== 'NET' && elem.text !== 'REGION');

    return groupLevelsWithoutNet;
  };

  saveFilterData = () => {
    // copy the main filter
    const mainFilter = this.getMainFilterState() || {};

    // clone the main filter
    let newFilter = _.cloneDeep(mainFilter);

    // parse the new data
    const { level, selectedNe } = this.state;

    if (level && selectedNe.length && level != 'NET') {
      newFilter.filter = {
        [level]: selectedNe,
      };
      newFilter.groupLevel1 = level;
    } else {
      newFilter.filter = {};
    }

    this.context.updateParent({ silentFilterUpdate: newFilter });
  };

  /* Handlers */
  handleChanges = (e) => {
    const { target } = e;
    const { name } = target;
    let { value } = target;

    const { level } = this.state;

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

  handleNeModalSave = (selectedNe) => {
    this.handleNeModalCancel();

    this.setState(
      {
        selectedNe,
      },
      this.saveFilterData
    );
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
    const { level, selectedNe, loadingRequests } = this.state || {};
    const filterLevelsList = this.getParsedGroupLevels();

    const classForSelectionButtons = loadingRequests === false ? 'fa fa-search' : 'fa fa-cog fa-spin';

    return (
      <div ref="el" className="advanced-filter">
        <div className="cl-element">
          <Select2
            name={'level'}
            style={{ width: '100%' }}
            data={filterLevelsList || []}
            value={[level]}
            options={{
              placeholder: 'Select Filter Level',
            }}
            onSelect={this.handleChanges}
            onUnselect={this.handleChanges}
          />
        </div>
        <div className="cl-element ne-select btn-select2-addon">
          <Select2
            name={'ne'}
            style={{ width: '100%' }}
            options={{
              disabled: true,
              placeholder: `Selected ${selectedNe.length} elements`,
            }}
          />
          <button
            className="btn btn-default"
            data-toggle="tooltip"
            data-placement="top"
            title="Advanced Filter"
            onClick={this.handleNeModalShow}
            disabled={level === 'NET' || !level || loadingRequests === true}
          >
            <i className={classForSelectionButtons} />
          </button>
        </div>

        {/* NE Modal instance */}
        <NetworkSelectorModal
          items={this.state.neGrid.data || []}
          alias={this.state.neGrid.alias || []}
          selectedItems={this.state.selectedNe}
          title="Network Elements Selector"
          show={this.state.showNeSelectorModal}
          onCancel={this.handleNeModalCancel}
          onSave={this.handleNeModalSave}
        />
      </div>
    );
  }
}

AdvancedFilter.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
