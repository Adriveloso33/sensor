import React from 'react';
import Select2 from 'react-select2-wrapper';
import SensorsModal from './SensorsModal';

export default class InlineSensorSelector extends React.Component {
  constructor(props) {
    super(props);
    this.url = 'assets/api/sensors.json';
    this.state = {
      data: [],
      loadingRequests: false,
      selectedSensor: [],
      showSensorSelectorModal: false,
    };
  }

  /* React Lifecycle methods */
  componentDidMount() {
    this.initializeData();
  }

  initializeData = () => {
    axios
      .get(this.url, {
        params: {
          pruebas: 'test',
        },
      })
      .then((response) => {
        const { data } = response || {};
        const { sensors } = data || {};

        this.setState({
          // data: data,
          data: sensors,
        });
      });
  };

  getMainFilterState = () => {
    return this.props.mainFilter;
  };

  /* Handlers */
  handleChanges = (e) => {
    const { target } = e;
    const { name } = target;
    const { value } = target;

    const field = name.replace(`_${this.radioId}`, '');

    this.setState(
      {
        [field]: value,
      },
      this.saveFilterData
    );
  };

  handleSelectorModal = (modalName = 'none', show = false) => {
    this.setState({
      [modalName]: show,
    });
  };

  handleSaveSensorSelector = (selectedSensor) => {
    this.handleSelectorModal('showSensorSelectorModal', false);

    this.setState(
      {
        selectedSensor,
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

  getSelectedSensor = (selectedSensor) => {
    if (selectedSensor.length === 0) {
      return null;
    }
    const selectedSensorString = `${selectedSensor.sensor} | ${selectedSensor.name}`;

    return selectedSensorString;
  };

  render() {
    const { loadingRequests, selectedSensor } = this.state;

    const selectedSensorString = this.getSelectedSensor(selectedSensor);
    const infoSelectText = 'Select a sensor';
    const classForSelectionButtons = loadingRequests === false ? 'fa fa-search' : 'fa fa-cog fa-spin';

    return (
      <div className="advanced-filter" style={{ display: 'block', height: '30px', width: '100%' }}>
        <div className="cl-element btn-select2-addon">
          <Select2
            style={{ width: '100%' }}
            options={{
              disabled: true,
              placeholder: selectedSensorString || infoSelectText,
            }}
          />
          <button
            type="button"
            className="btn btn-default"
            style={{ zIndex: 'auto' }}
            data-toggle="tooltip"
            data-placement="top"
            disabled={loadingRequests === true}
            onClick={() => {
              this.handleSelectorModal('showSensorSelectorModal', true);
            }}
          >
            <i className={classForSelectionButtons} />
          </button>
        </div>

        <SensorsModal
          data={this.state.data}
          maxElements={1}
          selectedItems={this.state.selectedSensor}
          title="Sensor Selector"
          show={this.state.showSensorSelectorModal}
          onCancel={() => {
            this.handleSelectorModal('showSensorSelectorModal', false);
          }}
          onSave={this.handleSaveSensorSelector}
          onConfigSave={this.handleKpisConfigSave}
        />
      </div>
    );
  }
}
