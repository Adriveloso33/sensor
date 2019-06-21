import React from 'react';
import PropTypes from 'prop-types';

import 'flatpickr/dist/themes/dark.css';
import Flatpickr from 'react-flatpickr';

import HourlyList from './HourlyList';
import ClearButton from './ClearButton';
import TimePlugin from './TimePlugin';

const defaultDateFormat = 'YYYY-MM-DD';

export default class DatePicker extends React.Component {
  static propTypes = {
    showTimePicker: PropTypes.bool,
    handleTimePicker: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    showTimePicker: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      key: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { options } = nextProps || {};

    const isUpdateNeeded =
      !_.isEqual(options, this.props.options) || nextProps.showTimePicker !== this.props.showTimePicker;

    if (isUpdateNeeded) {
      const { key } = this.state || {};
      this.setState({
        key: key + 1,
      });
    }
  }

  getMode = () => {
    const { props } = this;
    const { options } = props || {};
    const { mode } = options || {};

    return mode;
  };

  getAdjustFormat = () => {
    return this.props.adjustDateFormat || defaultDateFormat;
  };

  handleChanges = (values) => {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      this.props.onChange(values);
    }
  };

  handleTimePicker = (timeSelection) => {
    const { handleTimePicker } = this.props;

    if (typeof handleTimePicker === 'function') {
      handleTimePicker(timeSelection);
    }
  };

  // disable the others days when week, month granularity
  disableFunction = (date) => {
    const { groupDateTime } = this.props || {};
    let disable = false;

    switch (groupDateTime) {
      case '7d':
        disable = date.getDay() !== 1;
        break;
      case '30d':
        disable = date.getDate() !== 1;
        break;
      case '1y':
        disable = date.getMonth() !== 0 || date.getDate() !== 1;
    }

    const { disableDates } = this.props;
    if (disableDates) {
      const dateFormated = moment(date).format(defaultDateFormat);

      disableDates.forEach(function(disableDate) {
        const checkDate = moment(disableDate).format(defaultDateFormat);

        if (checkDate == dateFormated) disable = true;
      });
    }

    return disable;
  };

  getDisableFunction = () => {
    const mode = this.getMode();
    if (mode !== 'range') {
      return [this.disableFunction];
    }

    return [];
  };

  getFirstDateOf = (currentDate, groupDateTime) => {
    let dayOfWeek = moment(currentDate).day() - 1;
    let dayOfMonth = moment(currentDate).date() - 1;
    let days = 0;

    switch (groupDateTime) {
      case '7d':
        days = -dayOfWeek;
        break;
      case '30d':
        days = -dayOfMonth;
        break;
    }

    return moment(currentDate)
      .add(days, 'days')
      .format(this.getAdjustFormat());
  };

  getDateValue = (dateValue) => {
    const { props } = this || {};
    const { groupDateTime } = props || {};

    return this.getFirstDateOf(dateValue, groupDateTime);
  };

  getClassName = () => {
    const mode = this.getMode();
    const { className = '' } = this.props;

    if (mode == 'range') return `flatpickrRange ${className}`;

    return className;
  };

  adjustDatesWithGranularity = (currentDates) => {
    if (!currentDates) return;

    const mode = this.getMode();
    if (mode == 'range') return currentDates;

    const newDates = currentDates.map((singleDate) => {
      let adjustedSingleDate = this.getDateValue(singleDate);

      return adjustedSingleDate;
    });

    return newDates;
  };

  removeDuplicatesDates = (datesList) => {
    const uniqueList = Array.from(new Set(datesList));

    return uniqueList;
  };

  notifyWhenAdjusted = (values, newValues) => {
    const areEquals = _.isEqual(values, newValues);

    if (!areEquals) {
      this.handleChanges(newValues);
    }
  };

  processOptions = (options) => {
    const clonedOptions = _.cloneDeep(options); // this is because Flatpickr internally modified props
    clonedOptions.disable = this.getDisableFunction();

    if (this.props.showTimePicker) {
      clonedOptions.plugins = [
        new TimePlugin({
          onChange: this.handleTimePicker,
          selectedHours: this.props.selectedHours || 'all',
          clearButton: true,
        }),
      ];
    }

    return clonedOptions;
  };

  render() {
    const { props } = this;
    const { value, options, showIcon } = props || {};
    const { key } = this.state || {};

    const parsedOptions = this.processOptions(options);

    const adjustedDates = this.adjustDatesWithGranularity(value);
    const newValues = this.removeDuplicatesDates(adjustedDates);

    this.notifyWhenAdjusted(value, newValues);

    const className = this.getClassName();

    return (
      <div key={key} className="date-picker" style={{ height: '30px' }}>
        {showIcon === true && (
          <span className="date-picker-icon">
            <i className="fa fa-calendar" />
          </span>
        )}
        <Flatpickr
          className={className}
          onChange={this.handleChanges}
          value={newValues}
          placeholder="Select date"
          options={parsedOptions}
        />

        {this.props.showTimePicker && [<HourlyList />, <ClearButton />]}
      </div>
    );
  }
}
