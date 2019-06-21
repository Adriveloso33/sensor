import React from 'react';

import Select2 from 'react-select2-wrapper';
import SketchColor from '../../forms/inputs/Colorselect';

import WdnaColors from '../../../helpers/HighChartColors';

const colorsLimit = WdnaColors.length;

const axisTypes = [
  {
    id: 0,
    text: '',
    icon: 'fa fa-arrow-left margin-right-5',
  },
  {
    id: 0,
    text: '',
    icon: 'fa fa-arrow-right margin-right-5',
  },
];

// ICONOS para tipo de CHART
// Falta el SPLINE - ¿Se puede usar una imagen?
// https://fontawesome.com/icons/chart-line?style=regular
// https://fontawesome.com/icons/chart-bar?style=regular
// https://fontawesome.com/icons/chart-area?style=regular

const serieTypes = [
  {
    id: 'spline',
    text: 'Spline',
  },
  {
    id: 'line',
    text: 'Line',
  },
  {
    id: 'column',
    text: 'Column',
  },
  {
    id: 'area',
    text: 'Area',
  },
];

const defaultSerieColor = '#008aad';

export default class SerieInlineConfiguration extends React.Component {
  constructor(props) {
    super(props);

    const { indexNumber } = props;

    this.state = {
      yAxis: axisTypes[0].id, // 0 for left, 1 for right
      type: serieTypes[0].id,
      color: WdnaColors[indexNumber % colorsLimit] || defaultSerieColor,
      ...props, // override if props are passed
    };
  }

  /* Event Handlers */
  handleAxisChanges = (e) => {
    e.preventDefault();
    const { yAxis } = this.state;

    let nextyAxis = yAxis === 0 ? 1 : 0;
    this.setState(
      {
        yAxis: nextyAxis,
      },
      this.updateConfig
    );
  };

  handleSerieTypesChanges = (e) => {
    e.preventDefault();
    const { value } = e.target;

    this.setState(
      {
        type: value,
      },
      this.updateConfig
    );
  };

  handleColorChanges = (id, color) => {
    this.setState(
      {
        color,
      },
      this.updateConfig
    );
  };

  /* Exporting states */
  updateConfig = () => {
    const { yAxis, type, color } = this.state;
    const itemConfig = {
      yAxis,
      type,
      color,
    };

    this.exportConfig(itemConfig);
  };

  exportConfig = (itemConfig) => {
    const { onInlineConfigChange, id } = this.props;

    if (typeof onInlineConfigChange === 'function') {
      onInlineConfigChange(id, itemConfig);
    }
  };

  render() {
    const { yAxis, type, color } = this.state;
    const { showAxisSelector, showSerieType, showColorPicker } = this.props;

    const elementsToRender = [];
    if (showAxisSelector !== false) {
      elementsToRender.push(
        <span className="axis-selector-btn">
          <button type="button" className="btn btn-xs btn-transparent" onClick={this.handleAxisChanges}>
            {yAxis === 0 && (
              <span>
                <i className={axisTypes[0].icon} /> {axisTypes[0].text}{' '}
              </span>
            )}
            {yAxis === 1 && (
              <span>
                <i className={axisTypes[1].icon} /> {axisTypes[1].text}{' '}
              </span>
            )}
          </button>
        </span>
      );
    }

    if (showColorPicker !== false) {
      elementsToRender.push(
        <span className="serie-color-select">
          <SketchColor color={color} name={'serie-color'} handleChange={this.handleColorChanges} />
        </span>
      );
    }

    if (showSerieType !== false) {
      elementsToRender.push(
        <span className="serie-type-select">
          <Select2
            name="serie-type"
            data={serieTypes}
            value={type}
            options={{
              placeholder: 'Serie type',
            }}
            onSelect={this.handleSerieTypesChanges}
            onUnselect={this.handleSerieTypesChanges}
            style={{ width: '100%' }}
          />
        </span>
      );
    }

    return elementsToRender;
  }
}
