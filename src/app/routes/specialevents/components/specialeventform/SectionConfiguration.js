import React from 'react';
import PropTypes from 'prop-types';

import Select2 from 'react-select2-wrapper';

import { checkAuthError } from '../../../../components/auth/actions';
import { warningMessage, errorMessage } from '../../../../components/notifications';
import { familyLevelRequest, networkFiltersRequest } from '../../requests';
import Loader from '../../../../components/dashboards/components/Loader';
import NetworkSelectorModal from '../../../../components/modals/selectors/network/NetworkSelectorModal';

export default class SectionDescription extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: null,
      loading: false,
      eventType: '',
      siteType: '',
      siteClass: '',
      showNeSelectorModal: false,
      selectedNe: [],
      familyLevel: null,
      filtersData: [],
      filtersAlias: [],
      loadingrequests: null,
      vendor_id: false,
      filterLevel: false,
      tableData: [],
    };
  }

  // ==============================
  //         COMPONENTS
  // ==============================

  componentDidMount() {
    this.props.onRef(this);
    this.context.updateParent({
      deleteRow: this.deleteRow,
    });
  }

  componentWillReceiveProps(nextProps, nextContex) {
    const { currentStep, step } = this.props || null;
    const { vendor_id, region_id, filterLevel } = this.state;
    const nextStep = nextProps.currentStep || null;

    if (vendor_id != nextProps.vendor_id || region_id != nextProps.region_id || filterLevel != nextProps.filterLevel) {
      this.setState({
        selectedNe: [],
      });
    }
    this.setState({
      ...nextProps,
    });

    if (currentStep != nextStep && nextStep == step) {
      this.getFamilyLevel(this.state.vendor_id, this.getNeFilters);
    }
  }

  // ==============================
  //            HANDLE
  // ==============================

  handleChange = (e) => {
    let { name, value } = e.target;
    if (!value || value == '') value = null;
    this.setState({
      [name]: value,
    });
  };

  handleNeModalShow = (e) => {
    e.preventDefault();
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

    this.setState({
      selectedNe,
    });
  };

  // ==============================
  //      VENDOR / FAMILY LEVEL
  // ==============================

  getFamilyLevel = (vendor_id, cb) => {
    familyLevelRequest(vendor_id)
      .then((data) => {
        this.setState(
          {
            familyLevel: data,
          },
          () => {
            this.context.updateParent({ familyLevel: data });
            if (typeof cb === 'function') cb(data);
          }
        );
      })
      .catch((err) => {
        console.log(err);
        if (!checkAuthError(err)) errorMessage('Error', 'Error while retrieving the family level.');
      });
  };

  getNeFilters = (familyLevel) => {
    const { vendor_id, region_id, filterLevel } = this.state;
    if (!vendor_id) return;

    this.startLoadingForBackgroundRequests();

    return new Promise((resolve, reject) => {
      networkFiltersRequest(vendor_id, region_id, familyLevel, filterLevel)
        .then((response) => {
          const { data, alias } = response;
          this.setState(
            {
              filtersData: data,
              filtersAlias: alias,
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

  // ==============================
  //          TABLE DATA
  // ==============================

  addToTable = (e) => {
    e.preventDefault();
    let { selectedNe, tableData, eventType, siteClass, siteType } = this.state;
    if (selectedNe.length < 1) return;
    if (this.wrongFields()) return;
    const newData = selectedNe.map((cell) => {
      return {
        COL_1: eventType,
        COL_2: siteType,
        COL_3: siteClass,
        COL_4: cell,
      };
    });
    tableData = tableData.concat(newData);

    this.setState({
      tableData,
      selectedNe: [],
      eventType: null,
      siteClass: null,
      siteType: null,
    });
    this.context.updateParent({
      tableData,
    });
  };

  wrongFields = () => {
    let { eventType, siteClass, siteType } = this.state;
    if (/^[a-zA-Z0-9.()_ ]*$/.test(eventType) == false) {
      warningMessage('Warning', 'Please remove special characters in event type');
      return true;
    } else if (eventType && eventType.length > 200) {
      warningMessage('Warning', 'Event type has to be less than 200 characters');
      return true;
    }
    if (/^[a-zA-Z0-9.()_ ]*$/.test(siteType) == false) {
      warningMessage('Warning', 'Please remove special characters in site type');
      return true;
    } else if (siteType && siteType.length > 200) {
      warningMessage('Warning', 'Site type has to be less than 200 characters');
      return true;
    }
    if (/^[a-zA-Z0-9.()_ ]*$/.test(siteClass) == false) {
      warningMessage('Warning', 'Please remove special characters in site classification');
      return true;
    } else if (siteClass && siteClass.length > 200) {
      warningMessage('Warning', 'Site classification has to be less than 200 characters');
      return true;
    }
    return false;
  };

  getUpdatedNeData = () => {
    let { tableData, filtersData } = this.state;
    let updatedData = _.cloneDeep(filtersData) || [];
    tableData.forEach((row) => {
      updatedData.splice(
        updatedData.findIndex((item) => {
          return item.COL_1 == row.COL_4;
        }),
        1
      );
    });
    return updatedData;
  };

  deleteRow = (rowData) => {
    let { tableData } = this.state;
    tableData.splice(
      tableData.findIndex((row) => {
        return row.COL_4 == rowData.COL_4;
      }),
      1
    );
    this.setState(
      { tableData },
      this.context.updateParent({
        tableData,
      })
    );
  };

  // ==============================
  //           RENDER
  // ==============================

  render() {
    let { eventType, siteType, siteClass, selectedNe, filtersAlias } = this.state;
    const { loading, loadingRequests } = this.state;

    const filterButtonClass = !loadingRequests ? 'fa fa-search' : 'fa fa-cog fa-spin';
    const nItems = selectedNe.length;
    const defText = nItems > 0 ? `${nItems} items selected` : 'Advanced Network Filter';

    return (
      <div className="general-filters">
        <Loader show={loading} overlay={true} />
        <h3>
          <strong>Step 2 </strong> - Configuration
        </h3>
        <form className="smart-form smart-fix" style={{ padding: 0 }}>
          <fieldset>
            <div className="row">
              <span className="col col-4">
                <div className="cl-element ne-select btn-select2-addon" style={{ marginLeft: '0px' }}>
                  <Select2
                    name={'ne'}
                    style={{ width: '100%' }}
                    options={{
                      disabled: true,
                      placeholder: defText,
                    }}
                  />
                  <button
                    className="btn btn-default"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Advanced Filter"
                    onClick={this.handleNeModalShow}
                    disabled={false}
                  >
                    <i className={filterButtonClass} />
                  </button>
                </div>
                <br />
                <br />
                <div>
                  <button onClick={this.addToTable} className="btn btn-sm btn-primary">
                    <i className="fa fa-load" /> Add items to table
                  </button>
                </div>
              </span>
              <span className="col col-4">
                <div>
                  <section>
                    <label className="label">Event Type</label>
                    <label className="input">
                      <input
                        type="text"
                        name="eventType"
                        placeholder="Event type"
                        value={eventType || ''}
                        onChange={this.handleChange}
                      />
                    </label>
                  </section>
                </div>
                <div>
                  <section>
                    <label className="label">Site Type</label>
                    <label className="input">
                      <input
                        type="text"
                        name="siteType"
                        placeholder="Site type"
                        value={siteType || ''}
                        onChange={this.handleChange}
                      />
                    </label>
                  </section>
                </div>
                <div>
                  <section>
                    <label className="label">Site Classification</label>
                    <label className="input">
                      <input
                        type="text"
                        name="siteClass"
                        placeholder="Site classification"
                        value={siteClass || ''}
                        onChange={this.handleChange}
                      />
                    </label>
                  </section>
                </div>
              </span>
            </div>
          </fieldset>
        </form>
        {/* NE Modal instance */}
        <NetworkSelectorModal
          items={this.getUpdatedNeData() || []}
          alias={filtersAlias || {}}
          selectedItems={selectedNe}
          title="Network Elements Selector"
          show={this.state.showNeSelectorModal}
          onCancel={this.handleNeModalCancel}
          onSave={this.handleNeModalSave}
        />
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
