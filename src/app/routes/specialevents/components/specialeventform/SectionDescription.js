import React from 'react';
import PropTypes from 'prop-types';
import Select2 from 'react-select2-wrapper';

import { warningMessage } from '../../../../components/notifications';
import { vendorsRequest } from '../../requests';
import Loader from '../../../../components/dashboards/components/Loader';
import DatePicker from '../../../../components/datepicker/DatePicker';

const defaultDateFormat = 'YYYY-MM-DD';

const sectionManagedItems = [
  'eventName',
  'eventDescription',
  'vendor_id',
  'region_id',
  'filterLevel',
  'vendor',
  'vendorList',
  'filterLevelList',
  'dates',
];

export default class SectionDescription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: null,
      filter: null,
      vendor_id: false,
      vendor: false,
      vendorList: false,
      eventName: false,
      eventDescription: '',
      category: false,
      filterLevel: false,
      filterLevelList: [{ id: 'BTS_ID', text: 'BTS' }, { id: 'CEL_ID', text: 'CELL' }],
      loading: false,
      dates: [],
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    this.getVendors();
    this.exportValidationFunctions();
  }

  componentWillReceiveProps(nextProps, nextContex) {
    const { currentStep, step } = this.props || null;
    const nextStep = nextProps.currentStep || null;

    if (currentStep != nextStep && nextStep == step) {
      this.exportValidationFunctions();
    }
    this.setState({
      ...nextProps,
    });
  }

  // ==============================
  //   CHILD-PARENT INTERACTION
  // ==============================

  notifyFilterChange = (resetTable) => {
    const mainFilter = this.getFilterState();
    if (resetTable) mainFilter.tableData = [];
    this.context.updateParent(mainFilter);
  };

  getFilterState = () => {
    const { state } = this;

    const mainFilter = _.cloneDeep(state);

    const cleanedFilter = this.cleanFilter(mainFilter, sectionManagedItems);

    return cleanedFilter;
  };

  cleanFilter = (filter, allowedItems = []) => {
    if (!filter) return null;

    const cleanedFilter = {};

    Object.keys(filter).forEach((itemName) => {
      const isAllowed = allowedItems.indexOf(itemName) !== -1;
      if (!isAllowed) return null;

      const itemValue = filter[itemName];
      cleanedFilter[itemName] = itemValue;
    });

    return _.cloneDeep(cleanedFilter);
  };

  exportValidationFunctions = () => {
    this.context.updateParent({
      canSectionGoNext: this.canSectionGoNext,
      showSectionErrors: this.showSectionErrors,
    });
  };

  canSectionGoNext = () => {
    let { vendor_id, vendorList, eventName, region_id, filterLevel, eventDescription } = this.state;
    const canGoNext =
      vendor_id &&
      vendorList &&
      eventName &&
      region_id &&
      filterLevel &&
      /^[a-zA-Z0-9.()_ ]*$/.test(this.state.eventName) &&
      eventDescription.length < 350 &&
      eventName.length < 90;
    return canGoNext;
  };

  showSectionErrors = () => {
    if (!this.state.vendor_id) {
      warningMessage('Warning', 'Please select a valid vendor');
      return null;
    } else if (!this.state.region_id) {
      warningMessage('Warning', 'Please enter a valid region');
      return null;
    }
    if (!this.state.eventName) {
      warningMessage('Warning', 'Please enter an event name');
      return null;
    } else if (/^[a-zA-Z0-9.()_ ]*$/.test(this.state.eventName) == false) {
      warningMessage('Warning', 'Please remove special characters in event name');
      return null;
    } else if (this.state.eventName.length > 90) {
      warningMessage('Warning', 'Event name has to be less than 90 characters');
      return null;
    }
    if (!this.state.filterLevel) {
      warningMessage('Warning', 'Please enter a filter type');
      return null;
    }
    if (this.state.eventDescription.length > 350) {
      warningMessage('Warning', 'Event description has to be less than 350 characters');
      return null;
    }
  };

  // ==============================
  //            HANDLERS
  // ==============================

  handleVendorChange = (e) => {
    let vendor = this.getVendorInfo(e.target.value);
    if (vendor.id === this.state.vendor_id) return;
    const region = vendor.visible_zone ? null : vendor.zone[0].id;
    this.setState(
      {
        vendor_id: vendor.id,
        vendor: vendor.text,
        region_id: region,
      },
      () => {
        this.notifyFilterChange(true);
      }
    );
  };

  handleZoneChange = (e) => {
    this.setState(
      {
        region_id: parseInt(e.target.value),
      },
      () => {
        this.notifyFilterChange(true);
      }
    );
  };

  handleChange = (e) => {
    const resetTable = e.target.name == 'filterLevel';
    this.setState(
      {
        [e.target.name]: e.target.value,
      },
      () => {
        this.notifyFilterChange(resetTable);
      }
    );
  };

  handleDatePicker = (value) => {
    const parsedDates = value.map((singleDate) => {
      return moment(singleDate).format('YYYY-MM-DD');
    });
    this.setState(
      {
        dates: parsedDates,
      },
      () => {
        this.notifyFilterChange(false);
      }
    );
  };

  // ==============================
  //      VENDOR / ZONES
  // ==============================

  getVendors = (cb) => {
    vendorsRequest()
      .then((data) => {
        this.setState(
          {
            vendorList: data,
          },
          () => {
            if (typeof cb === 'function') cb(data);
          }
        );
      })
      .catch((err) => {
        if (!checkAuthError(err)) errorMessage('Error', 'Error while retrieving the vendor list.');
      });
  };

  getVendorInfo = (vendor_id) => {
    let { vendorList } = this.state;

    let vendor = vendorList && vendorList.find((elem) => elem.id == vendor_id);

    return vendor;
  };

  getZonesList = (vendor_id) => {
    const { vendorList } = this.state;

    const vendor = vendorList && vendorList.find((elem) => elem.id === vendor_id);

    if (vendor) return vendor.zone;
    return null;
  };

  getVisible_zone = (vendor_id) => {
    const { vendorList } = this.state;

    const vendor = vendorList && vendorList.find((elem) => elem.id === vendor_id);

    if (vendor) return vendor.visible_zone;
    return false;
  };

  // ==============================
  //          PARSERS
  // ==============================

  parseSelect2Data = (list) => {
    let newlist = _.cloneDeep(list);
    let items = [];
    newlist &&
      newlist.forEach((elem) => {
        items.push({
          id: elem.id,
          text: elem.text,
        });
      });
    return items;
  };

  // ==============================
  //           RENDER
  // ==============================

  render() {
    let { vendor_id, eventName, filterLevel, region_id, eventDescription, dates } = this.state;
    const { vendorList, filterLevelList, loading } = this.state;

    return (
      <div className="general-filters">
        <Loader show={loading} overlay={true} />
        <h3>
          <strong>Step 1 </strong> - Definition
        </h3>
        <form className="smart-form smart-fix" style={{ padding: 0 }}>
          <fieldset>
            <div className="row">
              <span className="col col-4">
                <div>
                  <section>
                    <label className="label">Vendor</label>
                    {vendorList && (
                      <Select2
                        name={'vendor_id'}
                        style={{ width: '100%' }}
                        value={vendor_id || ''}
                        multiple={false}
                        data={this.parseSelect2Data(vendorList) || []}
                        options={{
                          disabled: false,
                          placeholder: 'Vendor',
                        }}
                        onSelect={this.handleVendorChange}
                      />
                    )}
                  </section>
                </div>
                {this.getVisible_zone(vendor_id) && (
                  <div>
                    <section>
                      <label className="label">Zone</label>
                      <Select2
                        name={'region_id'}
                        style={{ width: '100%' }}
                        value={region_id || ''}
                        multiple={false}
                        data={this.getZonesList(vendor_id) || []}
                        options={{
                          disabled: false,
                          placeholder: 'Zone',
                        }}
                        onSelect={this.handleZoneChange}
                      />
                    </section>
                  </div>
                )}

                <div>
                  <section>
                    <label className="label">Event Name</label>
                    <label className="input">
                      <input
                        type="text"
                        name="eventName"
                        placeholder="Name"
                        value={eventName || ''}
                        onChange={this.handleChange}
                      />
                    </label>
                  </section>
                </div>

                <div>
                  <section>
                    <label className="label">Filter Type</label>
                    <Select2
                      name={'filterLevel'}
                      style={{ width: '100%' }}
                      value={filterLevel || ''}
                      multiple={false}
                      data={filterLevelList || []}
                      options={{
                        disabled: false,
                        placeholder: 'Filter Type',
                      }}
                      onSelect={this.handleChange}
                    />
                  </section>
                </div>
              </span>
              <span className="col col-8">
                <div>
                  <h3>Event Description</h3>
                  <label className="input">
                    <textarea
                      name="eventDescription"
                      ref="textFormula"
                      style={{ resize: 'none', width: '75%', marginBottom: '7px' }}
                      rows="8"
                      cols="150"
                      className="form-control"
                      value={eventDescription}
                      onChange={this.handleChange}
                    />
                  </label>
                </div>
                <div style={{ width: '32%' }}>
                  <DatePicker
                    showIcon={false}
                    value={dates}
                    onChange={this.handleDatePicker}
                    //groupDateTime={groupDateTime}
                    options={{
                      mode: 'multiple',
                      dateFormat: 'Y-m-d',
                      locale: {
                        firstDayOfWeek: 1, // start week on Monday
                      },
                      maxDate: moment()
                        .add('2', 'years')
                        .format(defaultDateFormat),
                      minDate: moment().format(defaultDateFormat),
                    }}
                  />
                </div>
              </span>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

// ==============================
//    CONTEXT CHILD -> PARENT
// ==============================

SectionDescription.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
