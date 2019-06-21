import React from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';
import NetworkSelectorModal from '../../../../components/modals/selectors/network/NetworkSelectorModal';

import { getParentState } from '../../../../helpers/GlobalHelper';
import { request1 } from '../../requests';

export default class AdvancedFilter extends React.Component {
  constructor(props) {
    super(props);

    this.fristRender = true;

    this.state = {
      showNeSelectorModal: false,

      level: null,
      selectedNe: [],

      data: [],
      alias: {},

      loading: false,
      loadingRequests: false
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    this.initializeData();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext !== this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      const { showAdvancedFilter } = nextState || {};
      if (showAdvancedFilter === true) {
        this.showAdvancedFilter();
      } else {
        this.hideAdvancedFilter();
      }

      const currentFilterOnChange = currentState.onFilterChange;
      const nextFilterOnChange = nextState.onFilterChange;
      if (!_.isEqual(currentFilterOnChange, nextFilterOnChange)) {
        this.getData(currentFilterOnChange, nextFilterOnChange);
      }
    }
  }

  initializeData = () => {
    const mainFilter = this.getMainFilterState();
    if (!mainFilter) return;

    this.getNeData(mainFilter);
  };

  getData = (currentFilter, nextFilter) => {
    if (this.isUpdateNeeded(currentFilter, nextFilter)) {
      this.setState(
        {
          selectedNe: [],
          level: null
        },
        () => {
          this.clearNeList();
          this.getNeData(nextFilter);
        }
      );
    }
  };

  /**
   * Returns true if the HTTP request needs to be done due the nextFilter has
   * a vendor different
   */
  isUpdateNeeded = (currentFilter = {}, nextFilter = {}) => {
    const { vendor_id, groupLevel } = currentFilter;

    const vendorHasChanged = vendor_id !== nextFilter.vendor_id;
    const groupLevelHasChanged = groupLevel !== nextFilter.groupLevel;

    return vendorHasChanged || groupLevelHasChanged;
  };

  /* HTML Request */
  getNeData = (mainFilter) => {
    const { vendor_id } = mainFilter;
    if (!vendor_id) return;

    const { level } = this.state;
    if (!level) return;

    this.startLoadingForBackgroundRequests();

    return new Promise((resolve, reject) => {
      request1(vendor_id, level)
        .then((response) => {
          const { data, alias } = response;
          this.setState(
            {
              data,
              alias
            },
            () => {
              resolve(response);
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

  /* Handle advanced filter slide */
  showAdvancedFilter = () => {
    const $el = $(this.refs.el);
    $el.slideDown();
  };

  hideAdvancedFilter = () => {
    const $el = $(this.refs.el);
    $el.slideUp();
  };

  clearNeList = () => {
    this.setState(
      {
        selectedNe: []
      },
      this.saveFilterData
    );
  };

  getMainFilterState = () => {
    const { getFilterInternalState } = getParentState(this);
    let filter = {};

    if (typeof getFilterInternalState === 'function') filter = getFilterInternalState();

    return filter;
  };

  getFiltersList = () => {
    const { filtersList } = getParentState(this);
    if (!filtersList) return [];

    const { groupLevel } = this.getMainFilterState();
    if (!groupLevel) return [];

    return filtersList[groupLevel];
  };

  saveFilterData = () => {
    const mainFilter = this.getMainFilterState();

    const newMainFilter = _.cloneDeep(mainFilter);

    // parse the new data
    const { level, selectedNe } = this.state;
    const isFilterValid = level && selectedNe && selectedNe.length;

    if (isFilterValid) {
      newMainFilter.filters = _.cloneDeep({ [level]: selectedNe });
    } else {
      newMainFilter.filters = {};
    }

    this.context.updateParent({ silentFilterUpdate: newMainFilter });
  };

  /* Handlers */
  handleChanges = (e) => {
    const { target } = e;
    const { name } = target;
    let { value } = target;

    const { level } = this.state;

    this.setState(
      {
        [name]: value
      },
      () => {
        if (level !== this.state.level) {
          this.clearNeList();
          this.getNeData(this.getMainFilterState());
        }
      }
    );
  };

  handleNeModalShow = () => {
    this.setState({
      showNeSelectorModal: true
    });
  };

  handleNeModalCancel = () => {
    this.setState({
      showNeSelectorModal: false
    });
  };

  handleNeModalSave = (selectedNe) => {
    this.handleNeModalCancel();

    this.setState(
      {
        selectedNe
      },
      this.saveFilterData
    );
  };

  startLoadingForBackgroundRequests = () => {
    this.setState({
      loadingRequests: true
    });
  };

  finishLoadingForBackgroundRequests = () => {
    this.setState({
      loadingRequests: false
    });
  };

  render() {
    const { level, selectedNe, loadingRequests } = this.state || {};
    const filterList = this.getFiltersList();
    const { vendor_id } = this.getMainFilterState();

    const neSelectPlaceHolder = vendor_id !== 'ALL' ? `Selected ${selectedNe.length} elements` : 'Select one vendor';
    const classForSelectionButtons = loadingRequests === false ? 'fa fa-search' : 'fa fa-cog fa-spin';

    return (
      <div ref="el" className="advanced-filter">
        <div className="cl-element">
          <Select2
            name={'level'}
            style={{ width: '100%' }}
            data={filterList || []}
            value={[level]}
            options={{
              placeholder: 'Select Filter Level',
              disabled: !vendor_id
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
              placeholder: neSelectPlaceHolder
            }}
          />
          <button
            className="btn btn-default"
            data-toggle="tooltip"
            data-placement="top"
            title="Advanced Filter"
            onClick={this.handleNeModalShow}
            disabled={vendor_id === 'ALL' || loadingRequests === true}
          >
            <i className={classForSelectionButtons} />
          </button>
        </div>

        {/* NE Modal instance */}
        <NetworkSelectorModal
          items={this.state.data}
          alias={this.state.alias}
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
  updateParent: PropTypes.func.isRequired
};
