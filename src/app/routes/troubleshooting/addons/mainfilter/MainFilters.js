import React from 'react';
import PropTypes from 'prop-types';

import VendorFilter from '../../../../components/mainfilter/components/VendorFilter';
import RegionFilter from '../../../../components/forms/inputs/Dropdown';
import AdvancedFilter from './AdvancedFilter';

import SliderTime from '../../../../components/datepicker/SliderTime';
import DatePicker from '../../../../components/datepicker/DatePicker';

import { checkAuthError } from '../../../../components/auth/actions';
import { errorMessage } from '../../../../components/notifications';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';

import {
  getParentState,
  getElementIdByText,
  getElementTextById,
  getElementIndexById,
} from '../../../../helpers/GlobalHelper';
import { parserDate } from '../../../../helpers/DateHelper';

import { blockSidebar, unblockSidebar } from '../../../../components/sidebar/SidebarActions';
import { setFilterData } from '../../../../components/mainfilter/MainFilterActions';

import { getKpisByReport } from '../../../../requests/entropy/dashboards';
import { getVendors, getReportFamilyLevelId, getGeneralFilterGroupLevel } from '../../../../requests/entropy';

const DateFormat = 'YYYY-MM-DD';
const defaultVendor = 'ATT_HUAWEI4G';
const defaultRegion = 'NATIONAL';

export default class MainFilters extends React.Component {
  constructor(props) {
    super(props);

    this.firstRender = true;
    this.pid = getStr();

    let { initialState } = props;
    if (!initialState) initialState = {};

    /* INITIAL FILTER STATE */
    this.state = {
      groupLevel1: 'CITY',

      groupDateTime: '24h', // granularity
      report: 'VOLTE_CQI',
      filter: {},

      vendor_id: null,
      region_id: null,
      family_level: null,

      date: [moment().format(DateFormat)],

      vendorList: null,
      regionList: null,

      lastDays: -6,

      // Mode flatpickr
      flatpickrMode: 'single',
      showAdvanced: false,
      showRegions: false,

      ...initialState,

      kpis: null,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    this.startUpProcess();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      if (nextState.silentFilterUpdate != currentState.silentFilterUpdate) {
        const filter = nextState.silentFilterUpdate;

        this.updateMainFilter(filter);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { vendorList, regionList, family_level, kpis } = this.state || {};
    const { firstRender } = this;

    const isInitialDataReady = vendorList && regionList && family_level && kpis;
    if (isInitialDataReady && firstRender) {
      this.firstRender = false;

      this.exportInitialData();
    }
  }

  startUpProcess = () => {
    this.startLoadingForBackgroundRequests();
    this.getVendorsAndZones();
  };

  getVendorsAndZones = () => {
    this.getVendorsList((vendorList) => {
      const vendor_id = this.state.vendor_id || getElementIdByText(vendorList, defaultVendor);

      const vendorIndex = getElementIndexById(vendorList, vendor_id);
      const vendorInfo = vendorList[vendorIndex];
      const showRegions = vendorInfo.visible_zone;

      this.setState(
        {
          vendorList,
          vendor_id,
          showRegions,
        },
        () => {
          const regionList = this.getRegionsForCurrentVendor();
          this.setState({ regionList });
          this.context.updateParent({ regionList });
          Promise.resolve(this.getDashboardFamilyLevel());
          Promise.resolve(this.getKpisForReport());
        }
      );

      this.context.updateParent({
        vendorList,
      });
    });

    /* export Get Internal State Function */
    this.context.updateParent({
      getFilterInternalState: this.getFilterState,
    });
  };

  getDashboardFamilyLevel = () => {
    const { vendor_id, vendorList, report } = this.state;
    const vendorName = getElementTextById(vendorList, vendor_id);

    return new Promise((resolve, reject) => {
      getReportFamilyLevelId(vendorName, report)
        .then((family_level) => {
          this.setState(
            {
              family_level,
            },
            () => {
              resolve(true);
            }
          );
        })
        .catch(() => {
          errorMessage('Error', 'Error while retrieving the family level for the Dashboard.');
          reject(false);
        });
    });
  };

  exportInitialData = () => {
    const region_id = this.state.region_id || this.getValidRegionForVendor();
    this.setState(
      {
        region_id,
      },
      () => {
        this.notifyFilterChange();
        this.exportMainFilter();
        this.reloadData();
      }
    );
  };

  reloadData = (cb) => {
    const requests = [this.getKpisForReport(), this.getFilterAndGroupLevels()];

    this.startLoadingForBackgroundRequests();
    Promise.all(requests)
      .then((values) => {
        if (typeof cb === 'function') cb();

        this.finishLoadingForBackgroundRequests();
      })
      .catch((error) => {
        const errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.finishLoadingForBackgroundRequests();
      });
  };

  exportMainFilter = () => {
    const mainFilter = this.getFilterState();

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
  getKpisForReport = () => {
    const { report, vendor_id } = this.state;

    return new Promise((resolve, reject) => {
      getKpisByReport(vendor_id, report)
        .then((kpis) => {
          this.setState(
            {
              kpis,
            },
            () => {
              resolve(true);
            }
          );
          this.context.updateParent({
            kpis,
          });
        })
        .catch((err) => {
          this.setState(
            {
              kpis: null,
            },
            () => {
              reject(err);
            }
          );
          this.context.updateParent({
            kpis: null,
          });
        });
    });
  };

  getFilterAndGroupLevels = () => {
    const { region_id, vendor_id, family_level } = this.state;

    return new Promise((resolve, reject) => {
      getGeneralFilterGroupLevel(region_id, vendor_id, family_level)
        .then((data) => {
          const filterLevels = data.filter['NET'];
          const groupLevel1 = data.groupLevel;

          this.context.updateParent({
            filterLevels,
            groupLevel1,
          });
          resolve(true);
        })
        .catch((err) => {
          this.context.updateParent({
            filterLevels: [],
            groupLevel1: [],
          });
          reject(err);
        });
    });
  };

  getVendorsList = (cb) => {
    getVendors()
      .then((data) => {
        if (typeof cb === 'function') cb(data);
      })
      .catch((err) => {
        if (!checkAuthError(err)) errorMessage('Error', 'Error while retrieving the vendor list.');
      });
  };

  getRegionsForCurrentVendor = () => {
    const { vendor_id } = this.state || {};
    if (!vendor_id) return [];

    const { vendorList } = this.state;
    const vendorIndex = getElementIndexById(vendorList, vendor_id);
    const vendorZones = vendorList[vendorIndex].zone;

    return vendorZones;
  };

  /* Utils */
  setValidRegionForVendor = () => {
    const region_id = this.getValidRegionForVendor();

    this.setState({
      region_id,
    });
  };

  getValidRegionForVendor = () => {
    const { regionList, region_id = defaultRegion } = this.state || {};

    const exist = getElementTextById(regionList, region_id);

    if (exist) return region_id;

    return regionList[0].id;
  };

  getFilterState = () => {
    const { state } = this;
    const mainFilter = _.cloneDeep(state);

    mainFilter.arrFilterDate = parserDate(this);
    if (state.kpis) mainFilter.aaKpiCounters = state.kpis.map((kpiInfo) => kpiInfo.id);

    /* clean the filter */
    delete mainFilter.regionList;
    delete mainFilter.vendorList;
    delete mainFilter.showAdvanced;
    delete mainFilter.showRegions;

    return mainFilter;
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

  startLoadingForBackgroundRequests = () => {
    store.dispatch(blockSidebar());
  };

  finishLoadingForBackgroundRequests = () => {
    store.dispatch(unblockSidebar());
  };

  /* Handlers */
  handleDatePicker = (value) => {
    this.setState(
      {
        date: value.length > 1 ? value : [moment(value[0]).format(DateFormat)],
      },
      this.notifyFilterChange
    );
  };

  handleVendorsListClick = (vendorInfo) => {
    const { id } = vendorInfo;
    const showRegions = vendorInfo.visible_zone;

    this.setState(
      {
        showRegions,
        vendor_id: id,
      },
      this.vendorChangesProcess
    );
  };

  handleRegionsListClick = (regionInfo) => {
    const { id } = regionInfo;

    this.setState(
      {
        region_id: id,
      },
      this.notifyFilterChange
    );
  };

  handleSlider = (e) => {
    this.setState(
      {
        lastDays: e.value,
        groupDateTime: e.range,
      },
      this.notifyFilterChange
    );
  };

  changeModeFlatPickr = () => {
    const nextMode = this.state.flatpickrMode == 'single' ? 'range' : 'single';
    let nextDate;

    const startDate = moment(Array.isArray(this.state.date) ? this.state.date[0] : this.state.date).format(DateFormat);

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
      this.notifyFilterChange
    );
  };

  handleFilterBtnClick = () => {
    try {
      this.validateMainFilter();
    } catch (Exception) {
      errorMessage('Error', Exception);
      return;
    }

    this.exportMainFilter();
  };

  validateMainFilter = () => {
    const mainFilter = this.getFilterState();

    const isAdvancedFilterValid = Object.keys(mainFilter.filter).length !== 0;
    if (!isAdvancedFilterValid) throw 'Please select some Network Elements';
  };

  handleAdvancedClick = () => {
    const { showAdvanced } = this.state;

    this.setState(
      {
        showAdvanced: !showAdvanced,
      },
      () => {
        this.context.updateParent({ showAdvancedFilter: !showAdvanced });
      }
    );
  };

  getSliderTime = (value, range) => ({
    value,
    range,
  });

  checkIfCanRun = () => {
    const { kpis } = getParentState(this) || {};

    return kpis && kpis.length > 0;
  };

  vendorChangesProcess = () => {
    const regionList = this.getRegionsForCurrentVendor();

    this.setState(
      {
        regionList,
      },
      () => {
        const region_id = this.getValidRegionForVendor();
        this.setState(
          {
            region_id,
          },
          () => {
            this.startLoadingForBackgroundRequests();
            this.reloadRegionsAndFamilyLevel(this.reloadData);
            this.notifyFilterChange();
          }
        );
      }
    );
  }

  reloadRegionsAndFamilyLevel = (cb) => {
    this.getDashboardFamilyLevel()
      .then(() => {
        this.notifyFilterChange();
        cb();
      })
      .catch(() => {});
  };

  render() {
    const { date, lastDays, flatpickrMode, groupDateTime } = this.state;
    const { vendorList, regionList, vendor_id, region_id, showRegions } = this.state;

    const startSliderTime = this.getSliderTime(lastDays, groupDateTime);

    return (
      <div>
        <div className="main-filters">
          <div className="row" style={{ marginBottom: '10px' }}>
            <SliderTime onChange={this.handleSlider} startValue={startSliderTime} disabled={flatpickrMode == 'range'} />
          </div>

          <div className="row">
            <div className="col-sm-12 btn-group-main">
              <button className="btn btn-default btn-secondary" onClick={this.changeModeFlatPickr}>
                {flatpickrMode == 'single' && <i className="fa fa-calendar-o" />}
                {flatpickrMode == 'multiple' && <i className="fa fa-calendar-o" />}
                {flatpickrMode == 'range' && <i className="fa fa-calendar" />}
              </button>
              <DatePicker
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
                  maxDate: moment().format('YYYY-MM-DD'),
                  minDate: moment()
                    .add('-1', 'years')
                    .format('YYYY-MM-DD'),
                }}
              />
            </div>
          </div>

          <VendorFilter
            vendor_id={vendor_id}
            items={vendorList}
            onChange={this.handleVendorsListClick}
            handleAdvancedClick={this.handleAdvancedClick}
          />

          {showRegions && (
            <RegionFilter
              title="Region"
              icon="wdna-location"
              items={regionList}
              active={region_id}
              onChange={this.handleRegionsListClick}
            />
          )}

          {vendor_id && region_id && (
            <AdvancedFilter mainFilter={this.state} vendor_id={vendor_id} region_id={region_id} />
          )}

          <div>
            <button
              type="button"
              className="filter-btn btn btn-default"
              onClick={this.handleFilterBtnClick}
              disabled={!this.checkIfCanRun()}
            >
              <i className="fa fa-play" />
              <span> GO</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

MainFilters.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
