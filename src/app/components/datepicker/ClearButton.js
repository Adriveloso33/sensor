import React, { Component } from 'react';

import './DateTimePicker.css';

class ClearButton extends Component {
  render() {
    return (
      <div id="clearButtonContainer" style={{ display: 'none' }}>
        <button>Clear</button>
      </div>
    );
  }
}

export default ClearButton;
