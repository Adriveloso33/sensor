import React from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';

import NetworkSelectorModal from '../../../../../../components/modals/selectors/network/NetworkSelectorModal';

import { getFilterLevels, getFilterData } from '../../../../requests';
import { errorMessage } from '../../../../../../components/notifications';

export default class AdvancedFilter extends React.Component {
  constructor(props) {
    super(props);

    this.fristRender = true;

    this.state = {
      filterLevel: null,
      selectedNe: [],

      filterList: [],
      data: [],
      alias: {},

      loading: false,
      loadingRequests: false,
      showNeSelectorModal: false,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    this.initializeData();
  }

  initializeData = () => {
    const mainFilter = this.getMainFilterState();

    this.loadFilterLevels(mainFilter);
  };

  /* HTML Request */
  loadFilterLevels = (mainFilter) => {
    this.startLoadingForBackgroundRequests();

    const paramsForRequest = this.getFilterLevelsParams(mainFilter);
    getFilterLevels(paramsForRequest)
      .then((filterList) => {
        this.setState({
          filterList,
        });
        this.finishLoadingForBackgroundRequests();
      })
      .catch(() => {
        this.finishLoadingForBackgroundRequests();
        errorMessage('Error', 'Error retrieving the filter level list');
      });
  };

  getFilterLevelsParams = (mainFilter) => {
    return mainFilter;
  };

  loadNeData = (mainFilter) => {
    if (!this.state.filterLevel) return;

    this.startLoadingForBackgroundRequests();

    const paramsForRequest = this.getNeDataParams(mainFilter);
    getFilterData(paramsForRequest)
      .then((responseData) => {
        this.setState({
          ...responseData,
        });
        this.finishLoadingForBackgroundRequests();
      })
      .catch(() => {
        this.finishLoadingForBackgroundRequests();
        errorMessage('Error', 'Error retrieving the filter level list');
      });
  };

  getNeDataParams = (mainFilter) => {
    const { filterLevel } = this.state;
    return {
      filter: filterLevel,
      ...mainFilter,
    };
  };

  clearNeList = () => {
    this.setState(
      {
        selectedNe: [],
      },
      this.saveFilterData
    );
  };

  getMainFilterState = () => {
    return this.props.mainFilter;
  };

  saveFilterData = () => {
    const mainFilter = this.getMainFilterState();

    const newMainFilter = _.cloneDeep(mainFilter);

    // parse the new data
    const { filterLevel, selectedNe } = this.state;
    const isFilterValid = filterLevel && selectedNe && selectedNe.length;

    if (isFilterValid) {
      newMainFilter.filters = _.cloneDeep({ [filterLevel]: selectedNe });
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

    const { filterLevel } = this.state;

    this.setState(
      {
        [name]: value,
      },
      () => {
        if (filterLevel !== this.state.filterLevel) {
          this.clearNeList();
          this.loadNeData(this.getMainFilterState());
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
    const { filterLevel, selectedNe, filterList, loadingRequests } = this.state || {};

    const neSelectPlaceHolder = `Selected ${selectedNe.length} elements`;
    const classForSelectionButtons = loadingRequests === false ? 'fa fa-search' : 'fa fa-cog fa-spin';

    return (
      <div ref="el" className="advanced-filter" style={{ display: 'block' }}>
        <div className="cl-element">
          <Select2
            name={'filterLevel'}
            style={{ width: '100%' }}
            data={filterList || []}
            value={[filterLevel]}
            options={{
              placeholder: 'Select Filter Level',
              disabled: loadingRequests === true,
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
              placeholder: neSelectPlaceHolder,
            }}
          />
          <button
            className="btn btn-default"
            data-toggle="tooltip"
            data-placement="top"
            title="Advanced Filter"
            onClick={this.handleNeModalShow}
            disabled={loadingRequests === true || !filterLevel}
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
  updateParent: PropTypes.func.isRequired,
};
