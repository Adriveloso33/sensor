import React, { Component } from 'react';

import './DateTimePicker.css';

class HourlyList extends Component {
  start = 0;
  end = 23;
  hours = [];

  constructor(props) {
    super(props);
    this.initializeHoursList();
  }

  initializeHoursList() {
    for (let i = this.start; i <= this.end; i++) {
      this.hours.push(
        <div id={`${i}`} key={i} className={`hourListItem hourListItem-${i}`}>
          {this.getFormattedHour(i)}
        </div>
      );
    }
  }

  getFormattedHour = (hour = 0, minutes = 0) => {
    return moment(new Date(1900, 1, 1, hour, minutes, 0, 0)).format('HH:mm');
  };

  getHoursList = (start, end) => {
    return this.hours.slice(start, end);
  };

  render() {
    return (
      <div id="hoursListContainer" style={{ display: 'none' }}>
        <div id="hoursList" className="hoursList">
          {this.getHoursList(0, 24)}
        </div>
      </div>
    );
  }
}

export default HourlyList;
