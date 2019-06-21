import React from 'react';
import PropTypes from 'prop-types';

import { JarvisWidget } from '../../../../components';

import GeneralWizard from '../../../../components/forms/wizards/GeneralWizard';
import Loader from '../../../../components/dashboards/components/Loader';

import SectionDescription from './SectionDescription';
import SectionConfiguration from './SectionConfiguration';
import MainTable from './MainTable';

import { warningMessage, successMessage, errorMessage } from '../../../../components/notifications';
import { getErrorMessage } from '../../../../components/utils/ResponseHandler';
import { insertSPE } from '../../requests';

export default class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.sectionsValidate = {};

    this.state = {
      showModal: false,
      currentStep: 1,
      vendor_id: false,
      loading: false,
      newSPE: true,
      id_event: null,
      initialized: false,
      ...props,
    };
  }

  componentDidMount() {
    const initialState = this.props;
    if (initialState) {
      this.setState({
        user_id: store.getState().getIn(['user']).id,
        ...initialState,
      });
    }
    this.setState({
      initialized: true,
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      // Listen for new data
      if (nextState != currentState) {
        this.setState({
          ...nextState,
        });
      }
    }
    if (this.state.initialized == false) {
      this.setState({
        ...nextProps,
      });
    }
  }

  getChildContext() {
    return {
      updateParent: this.updateParent,
      parentState: this.state,
      router: this.context.router,
    };
  }

  updateParent = (data, cb) => {
    this.setState(
      {
        ...data,
      },
      () => {
        if (typeof cb === 'function') cb();
      }
    );
  };

  onWizardComplete = () => {
    if (!this.errorsInTable()) {
      if (this.state.tableData.length < 1) {
        warningMessage('Warning', 'Please add some items to the table');
        return;
      }
      insertSPE(this.getPostData())
        .then((resp) => {
          successMessage(
            'Success',
            this.state.newSPE ? 'New Special Event added correctly' : 'Special Event edited correctly',
            5000
          );
          this.context.router.history.push(`/specialevents/main`);
        })
        .catch((error) => {
          console.log(error);
          errorMessage('Error', getErrorMessage(error));
        });
    }
  };

  errorsInTable = () => {
    let errors = false;
    this.state.tableData.forEach((row) => {
      Object.keys(row).forEach((col) => {
        if (/^[a-zA-Z0-9.()_ ]*$/.test(row[col]) == false && !errors) {
          warningMessage('Warning', 'Please remove special characters in table');
          errors = true;
        }
        if (row[col] && row[col].length > 200 && !errors) {
          warningMessage('Warning', 'Table fields have to be less than 200 characters');
          errors = true;
        }
      });
    });
    return errors;
  };

  getPostData = () => {
    const { state } = this;
    const table = state.tableData.map((row) => {
      return {
        EVENT_TYPE: row.COL_1,
        SITE_TYPE: row.COL_2,
        SITE_CLASSIFICATION: row.COL_3,
        ELEMENT: row.COL_4,
      };
    });
    return {
      vendor: state.vendor,
      vendor_id: state.vendor_id,
      region_id: state.region_id,
      name_spe: state.eventName,
      filter_type: state.filterLevel,
      user_id: state.user_id,
      id_event: state.id_event,
      new: state.newSPE,
      calendar: state.dates,
      description: state.eventDescription,
      table,
    };
  };

  handleNextStep = (e, data) => {
    const { nextStep, direction } = data;

    if (direction == 'previous' || direction == 'other') {
      this.setNextSectionStep(nextStep);
      return null;
    }
    if (direction == 'next' && this.checkIfCanGoNext()) {
      this.setNextSectionStep(nextStep);
      return null;
    }
    e.preventDefault();
    this.showCurrentSectionErrors();
  };

  setNextSectionStep = (nextStep) => {
    this.setState({
      currentStep: nextStep,
    });
  };

  checkIfCanGoNext = () => {
    const { canSectionGoNext } = this.state;
    if (typeof canSectionGoNext === 'function') return canSectionGoNext();

    return true;
  };

  showCurrentSectionErrors = () => {
    const { showSectionErrors } = this.state;

    if (typeof showSectionErrors === 'function') showSectionErrors();
  };

  goToNextStep = () => {
    this.GeneralWizard.goNextStep();
  };

  // ==============================
  //           RENDER
  // ==============================

  render() {
    const { currentStep, tableData } = this.state;
    const { loading } = this.state;
    let widgetTitle = 'Special Event';
    const tableAlias = {
      COL_1: 'Event Type',
      COL_2: 'Site Type',
      COL_3: 'Site Classification',
      COL_4: 'Element',
    };

    return (
      <div>
        <Loader show={loading} overlay={true} />
        <JarvisWidget
          editbutton={false}
          togglebutton={false}
          editbutton={false}
          fullscreenbutton={false}
          colorbutton={false}
          deletebutton={false}
          custombutton={false}
          className="jarviswidget-auto-height"
        >
          <header>
            <span className="widget-icon">
              <i className="fa fa-bar-chart-o" />
            </span>
            <h2>{widgetTitle}</h2>
          </header>
          <div className="widget-body" ref="widget_body">
            <div className="row">
              <div className="col-sm-12">
                <GeneralWizard
                  onRef={(ref) => (this.GeneralWizard = ref)}
                  className="widget-body fuelux"
                  onChange={() => {}}
                  onComplete={this.onWizardComplete}
                  customValidation={this.handleNextStep}
                >
                  <div className="wizard">
                    <ul className="steps">
                      <li data-step="1" className="active">
                        <span className="badge badge-info">1</span>
                        Event Definition
                        <span className="chevron" />
                      </li>

                      <li data-step="2">
                        <span className="badge">2</span>
                        Event Configuration
                        <span className="chevron" />
                      </li>
                    </ul>
                    <div className="actions">
                      <button type="button" className="btn btn-sm btn-primary btn-prev">
                        <i className="fa fa-arrow-left" />
                        Prev
                      </button>
                      <button type="button" className="btn btn-sm btn-success btn-next" data-last="Finish">
                        Next
                        <i className="fa fa-arrow-right" />
                      </button>
                    </div>
                  </div>

                  <div className="step-content">
                    <div className="step-pane active" data-step="1">
                      <SectionDescription
                        step="1"
                        currentStep={currentStep}
                        sectionName="Section 1"
                        onSelect={this.goToNextStep}
                        onRef={(ref) => (this.sectionsValidate['description'] = ref)}
                        {...this.state}
                      />
                    </div>

                    <div className="step-pane" data-step="2">
                      <SectionConfiguration
                        step="2"
                        currentStep={currentStep}
                        onRef={(ref) => (this.sectionsValidate['counterssql'] = ref)}
                        {...this.state}
                      />
                    </div>
                  </div>
                </GeneralWizard>
              </div>
            </div>
          </div>
        </JarvisWidget>
        {currentStep >= 2 && <MainTable data={tableData} alias={tableAlias} deleteRow={this.state.deleteRow} />}
      </div>
    );
  }
}

// ==============================
//    CONTEXT PARENT -> CHILD
// ==============================
MainForm.childContextTypes = {
  updateParent: PropTypes.func,
  parentState: PropTypes.object,
  router: PropTypes.object,
};

MainForm.contextTypes = {
  router: PropTypes.object,
};
