import React from 'react';
import PropTypes from 'prop-types';

import { errorMessage } from '../../../../../components/notifications';

import DatePicker from '../../../../../components/datepicker/DatePicker';
import SliderTime from '../../../../../components/datepicker/SliderTime';
import Dropdown from '../../../../../components/forms/inputs/Dropdown';
import AdvancedFilter from './AdvancedFilter';

import { setFilterData } from '../../../../../components/mainfilter/MainFilterActions';

import { blockSidebar, unblockSidebar } from '../../../../../components/sidebar/SidebarActions';
import { granularitiesList, cleanFilter } from '../../../../../helpers/FilterHelper';

import { parserDate } from '../../../../../helpers/DateHelper';

const defaultDateFormat = 'YYYY-MM-DD';
const defaultGroupDateTime = '24h';
const sectionAllowedItems = [
  'vendor',
  'vendor_id',
  'region_id',
  'id_event',
  'event_ne_type',
  'type',
  'report_graph',
  'graphConfig',
  'arrFilterNe',
  'arrFilterDate',
  'groupDateTime',
  'name_spe',
];

export default class MainFilters extends React.Component {
  constructor(props) {
    super(props);

    this.firstRender = true;
    this.pid = getStr();
    this.sliderKey = getStr();

    // init granularities values
    this.granularities = granularitiesList;
    this.marksConfigs = this.granularities.map((item) => item.id);

    const { initialState = {} } = props;

    /* INITIAL FILTER STATE */
    this.state = {
      groupDateTime: defaultGroupDateTime,
      arrFilterDate: [],
      arrFilterNe: [],

      filters: {},
      flatpickrMode: 'single',
      date: [moment().format(defaultDateFormat)],
      lastDays: this.getLastDaysForGranularity(defaultGroupDateTime),

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

  startUpProcess = () => {
    /* export Get Internal State Function and other useful functions and data */
    this.context.updateParent({
      getFilterInternalState: this.getFilterState,
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

  getFilterState = () => {
    const { state } = this;

    const mainFilter = _.cloneDeep(state);

    mainFilter.arrFilterDate = parserDate(this);

    // added compatibility with movers zone dashboards
    const { filters } = state;
    const arrFilters = Object.keys(filters).length !== 0 ? [filters] : [];
    mainFilter.arrFilterNe = arrFilters;

    const outputFilter = cleanFilter(mainFilter, sectionAllowedItems);

    return outputFilter;
  };

  getLastDaysForGranularity = (groupDateTime) => {
    switch (groupDateTime) {
      case '24h':
        return -6;
      case '7d':
        return -6;
      case '30d':
        return -1;
    }

    return 0;
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

    const parsedDates = value.map((singleDate) => moment(singleDate).format(defaultDateFormat));

    this.setState(
      {
        date: parsedDates,
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
    if (this.state.date.length === 0) throw 'Please select a valid date';
  };

  handleGranularity = (selectedGranularity) => {
    const groupDateTime = selectedGranularity.id;
    const lastDays = this.getLastDaysForGranularity(groupDateTime);
    const flatpickrMode = 'single';

    this.sliderKey = getStr();

    this.setState(
      {
        groupDateTime,
        flatpickrMode,
        lastDays,
      },
      this.notifyFilterChange
    );
  };

  handleSlider = (e) => {
    const groupDateTime = e.range;
    const flatpickrMode = 'single';

    this.setState(
      {
        groupDateTime,
        flatpickrMode,
        lastDays: e.value,
      },
      this.notifyFilterChange
    );
  };

  getSliderTime = (value, range) => {
    return {
      value: value,
      range: range,
    };
  };

  render() {
    const { date, groupDateTime, flatpickrMode, lastDays } = this.state;
    const { showRunBtn } = this.props;
    const startSliderTime = this.getSliderTime(lastDays, groupDateTime);

    return (
      <div className="main-filters cqi-main-filters">
        <Dropdown
          placeHolder="Select Granularity"
          title="Granularity"
          icon="fa fa-clock-o"
          onChange={this.handleGranularity}
          className="entropy-filter granularity-filter"
          active={groupDateTime}
          items={this.granularities}
        />

        <div key={this.sliderKey} className="row" style={{ marginBottom: '10px', marginTop: '10px' }}>
          <SliderTime
            marksConfigs={this.marksConfigs}
            onChange={this.handleSlider}
            startValue={startSliderTime}
            disabled={flatpickrMode !== 'single'}
            groupDateTime={groupDateTime}
          />
        </div>

        <div className="row">
          <div className="col-sm-12 btn-group-main">
            <button className="btn btn-default btn-secondary" onClick={this.changeModeFlatPickr}>
              {flatpickrMode == 'single' && <i className="fa fa-calendar-o" />}
              {flatpickrMode == 'range' && <i className="fa fa-calendar" />}
              {flatpickrMode == 'multiple' && <i className="fa fa-calendar-check-o" />}
            </button>
            <DatePicker
              showIcon={false}
              value={date}
              onChange={this.handleDatePicker}
              groupDateTime={groupDateTime}
              options={{
                mode: flatpickrMode,
                dateFormat: 'Y-m-d',
                weekNumbers: groupDateTime == '7d',
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

        <AdvancedFilter mainFilter={this.state} />

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
