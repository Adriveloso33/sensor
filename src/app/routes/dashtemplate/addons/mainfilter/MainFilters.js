import React from 'react';
import PropTypes from 'prop-types';

import Select2 from 'react-select2-wrapper';
import { checkAuthError } from '../../../../components/auth/actions';
import { errorMessage } from '../../../../components/notifications';

import DatePicker from '../../../../components/datepicker/DatePicker';
import VendorFilter from '../../../../components/mainfilter/components/VendorFilter';
import Dropdown from '../../../../components/forms/inputs/Dropdown';
import AdvancedFilter from './AdvancedFilter';

import { setFilterData } from '../../../../components/mainfilter/MainFilterActions';

import { blockSidebar, unblockSidebar } from '../../../../components/sidebar/SidebarActions';
import { granularitiesList, cleanFilter } from '../../../../helpers/FilterHelper';

import { parserDate } from '../../../../helpers/DateHelper';




import { request1, request2 } from '../../requests';

const defaultDateFormat = 'YYYY-MM-DD';
const startGranularity = '24h';
const sectionAllowedItems = [
  'type',
  'vendor',
  'vendor_id',
  'groupLevel',
  'groupDateTime',
  'arrFilterDate',
  'arrFilterNe',
];

export default class MainFilters extends React.Component {
  constructor(props) {
    super(props);

    this.firstRender = true;
    this.pid = getStr();

    this.granularities = granularitiesList.filter(this.filterGranularities);

    let { initialState } = props;
    if (!initialState) initialState = {};

    /* INITIAL FILTER STATE */
    this.state = {
      type: null,
      vendor: null,
      vendor_id: null,
      groupLevel: 'NET',
      groupDateTime: startGranularity,
      addDateTime: startGranularity, // for flatpickr multiple compatibility
      arrFilterDate: [],
      arrFilterNe: [],

      date: [
        moment()
          .add('days', -7)
          .format(defaultDateFormat),
        moment()
          .add('days', -1)
          .format(defaultDateFormat),
      ],
      lastDays: 0,
      filters: {},
      flatpickrMode: 'range',

      timeStart: '00:00',
      timeEnd: '23:00',

      vendorList: null,
      groupLevelsList: null,

      showAdvanced: false,

      ...initialState,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    this.startUpProcess();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext !== this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      if (!_.isEqual(nextState.silentFilterUpdate, currentState.silentFilterUpdate)) {
        this.updateMainFilter(nextState.silentFilterUpdate);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const firstLoadingIsFinished = this.firstRender && this.state.vendorList && this.state.groupLevelsList;
    if (firstLoadingIsFinished) {
      this.firstRender = false;

      this.notifyFilterChange();
      this.finishLoading();
    }
  }

  startUpProcess = () => {
    // this.startLoading();

    // required requests
    this.getVendorsList();
    this.getGroupLevelsList();

    /* export Get Internal State Function and other useful functions and data */
    this.context.updateParent({
      getFilterInternalState: this.getFilterState,
      getVendorName: this.getVendorName,
      getVendorId: this.getVendorId,
    });
  };

  updateMainFilter = (filter) => {
    const newFilter = _.cloneDeep(filter);

    this.setState(
      {
        ...newFilter,
      },
      this.notifyFilterChange
    );
  };

  exportMainFilter = () => {
    const mainFilter = this.getFilterState();

    /* Debug */
    console.log('Exporting main Filter');
    console.log(mainFilter);

    this.context.updateParent({
      mainFilter,
    });

    store.dispatch(setFilterData(mainFilter));
  };

  notifyFilterChange = () => {
    this.context.updateParent({
      onFilterChange: this.getFilterState(),
    });
  };

  /* main http requests */
  getVendorsList = (cb) => {
    request1(this.state.type)
      .then((data) => {
        this.setState(
          {
            vendorList: data,
          },
          () => {
            this.context.updateParent({ vendorList: data });
            if (typeof cb === 'function') cb(data);
          }
        );
      })
      .catch((err) => {
        console.log(err);
        if (!checkAuthError(err)) errorMessage('Error', 'Error while retrieving the vendor list.');
      });
  };

  getGroupLevelsList = () => {
    request2()
      .then((data) => {
        const { groupLevel, filter } = data;
        this.notifyListChanges('filtersList', filter);
        this.notifyListChanges('groupLevelsList', groupLevel);

        this.setState({
          groupLevelsList: groupLevel,
        });
      })
      .catch((err) => {
        console.log(err);
        if (!checkAuthError(err)) errorMessage('Error', 'Error while retrieving the group levels for the vendor.');
      });
  };

  getFilterState = () => {
    const { state } = this;

    const mainFilter = _.cloneDeep(state);

    const { vendor_id, filters = {} } = state;
    const vendorName = this.getVendorName(vendor_id);
    mainFilter.vendorName = vendorName;

    // added compatibility with movers zone dashboards
    const arrFilters = Object.keys(filters).length !== 0 ? [filters] : [];
    mainFilter.arrFilterNe = arrFilters;

    mainFilter.vendor = vendorName;
    mainFilter.arrFilterDate = parserDate(this);

    const outputFilter = cleanFilter(mainFilter, sectionAllowedItems);

    return outputFilter;
  };

  getVendorName = (vendor_id) => {
    const { vendorList } = this.state;

    const vendor = vendorList && vendorList.find((elem) => elem.id === vendor_id);

    if (vendor) return vendor.text;
    return null;
  };

  getVendorId = (vendorName) => {
    const { vendorList } = this.state;

    const vendor = vendorList && vendorList.find((elem) => elem.text === vendorName);

    if (vendor) return vendor.id;
    return null;
  };

  getLastDaysForGranularity = (groupDateTime) => {
    switch (groupDateTime) {
      case '24h':
        return 0;
      case '7d':
        return -6;
      case '30d':
        return -1;
    }

    return 0;
  };

  filterGranularities = (granularity) => {
    const { id } = granularity;
    return id !== 'rop' && id !== '60m';
  };

  startLoading = () => {
    store.dispatch(blockSidebar());
  };

  finishLoading = () => {
    store.dispatch(unblockSidebar());
  };

  /* Handlers */
  changeModeFlatPickr = () => {
    let nextMode = 'single';
    const { flatpickrMode } = this.state;

    if (flatpickrMode === 'single') nextMode = 'range';
    if (flatpickrMode === 'range') nextMode = 'multiple';

    let nextDate;

    const startDate = moment(Array.isArray(this.state.date) ? this.state.date[0] : this.state.date).format(
      'YYYY-MM-DD'
    );

    if (nextMode == 'range') {
      nextDate = [startDate, startDate];
    } else {
      nextDate = [startDate];
    }

    this.setState(
      {
        flatpickrMode: nextMode,
        date: nextDate,
      },
      this.getFilterState // for auto setup the right hour
    );
  };

  handleDatePicker = (value) => {
    const { flatpickrMode } = this.state;

    if (flatpickrMode === 'range' && value.length === 1) return;

    const parsedDates = value.map((singleDate) => moment(singleDate).format(defaultDateFormat));

    this.setState(
      {
        date: parsedDates,
      },
      this.notifyFilterChange
    );
  };

  handleVendorChanges = (vendor) => {
    this.setState(
      {
        vendor_id: vendor.id,
      },
      this.notifyFilterChange
    );
  };

  handleAdvancedFilterClick = () => {
    const { showAdvanced } = this.state;

    this.setState(
      {
        showAdvanced: !showAdvanced,
      },
      () => {
        this.context.updateParent({ showAdvancedFilter: this.state.showAdvanced });
      }
    );
  };

  handleGroupLevels = (e) => {
    const { target } = e;
    const { value } = target;

    this.setState(
      {
        groupLevel: value,
      },
      this.notifyFilterChange
    );
  };

  handleFilterBtnClick = () => {
    try {
      this.validateFilterData();
    } catch (Ex) {
      errorMessage('Error', Ex);
      return;
    }

    this.exportMainFilter();
  };

  validateFilterData = () => {
    if (!this.state.vendor_id) throw 'Please select a valid vendor';
    if (!this.state.groupLevel) throw 'Please select a valid group level';
    if (this.state.date.length === 0) throw 'Please select a valid date';
  };

  handleGranularity = (selectedGranularity) => {
    const groupDateTime = selectedGranularity.id;
    const addDateTime = groupDateTime;
    const lastDays = this.getLastDaysForGranularity(groupDateTime);

    const flatpickrMode = groupDateTime === '24h' ? this.state.flatpickrMode : 'multiple';

    this.setState({
      groupDateTime,
      addDateTime,
      flatpickrMode,
      lastDays,
    });
  };

  handleTime = (name, options) => {
    const { hour, minute } = options;
    this.setState({
      [name]: `${hour}:${minute}`,
    });
  };

  notifyListChanges = (listName, listData) => {
    this.context.updateParent({
      [listName]: listData,
    });
  };

  render() {
    const { date, groupDateTime, flatpickrMode, timeStart, timeEnd } = this.state;
    const { vendorList, vendor_id, groupLevelsList, groupLevel } = this.state;
    const { showRunBtn } = this.props;

    return (
      <div className="main-filters cqi-main-filters">
        <h4>Granularity</h4>
        <Dropdown
          placeHolder="Select Granularity"
          title="Granularity"
          icon="fa fa-clock-o"
          onChange={this.handleGranularity}
          className="entropy-filter granularity-filter"
          active={groupDateTime}
          items={this.granularities}
        />

        <div className="row">
          <div className="col-sm-12 btn-group-main">
            <button
              className="btn btn-default btn-secondary"
              onClick={this.changeModeFlatPickr}
              disabled={groupDateTime !== '24h'}
            >
              {flatpickrMode == 'single' && <i className="fa fa-calendar-o" />}
              {flatpickrMode == 'range' && <i className="fa fa-calendar" />}
              {flatpickrMode == 'multiple' && <i className="fa fa-calendar-check-o" />}
            </button>
            <DatePicker
              showIcon={false}
              showTimePicker={true}
              value={date}
              onChange={this.handleDatePicker}
              groupDateTime={'24h'}
              options={{
                mode: 'range',
                dateFormat: 'Y-m-d',
                locale: {
                  firstDayOfWeek: 1, // start week on Monday
                },
                maxDate: moment().format(defaultDateFormat),
                minDate: moment()
                  .add('-1', 'years')
                  .format(defaultDateFormat),
              }}
            />
          </div>
        </div>

        <VendorFilter
          items={vendorList}
          vendor_id={vendor_id}
          onChange={this.handleVendorChanges}
          handleAdvancedClick={this.handleAdvancedFilterClick}
        />

        <div className="group-level-selector">
          <Select2
            name="level"
            style={{ width: '100%' }}
            data={groupLevelsList || []}
            value={[groupLevel]}
            options={{
              placeholder: 'Select Group Level',
            }}
            onSelect={this.handleGroupLevels}
            onUnselect={this.handleGroupLevels}
          />
        </div>

        <AdvancedFilter />

        <div>
          {showRunBtn !== false && (
            <button type="button" className="filter-btn btn btn-default" onClick={this.handleFilterBtnClick}>
              <i className="fa fa-play" />
              <span> GO</span>
            </button>
          )}
        </div>
      </div>
    );
  }
}

MainFilters.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
