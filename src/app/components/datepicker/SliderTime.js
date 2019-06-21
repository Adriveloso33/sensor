import React from 'react';
import _ from 'lodash';

import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

export default class SliderTime extends React.Component {
  constructor(props) {
    super(props);
    this.marksConfigs = this.props.marksConfigs || ['30d', '7d', '24h'];

    this.marksConfigInit = this.props.startValue.range || '24h';

    this.state = {
      // Slider time
      marks: this.configSlider(this.marksConfigInit),
      marksRange: this.marksConfigInit,
      value: null
    };
  }

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip({ delay: { show: 500, hide: 100 }, trigger: 'hover' });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      const { marksConfigs } = nextProps;
      if (marksConfigs) this.marksConfigs = marksConfigs;
    }
  }

  // Cambiar con los botones. Al cambiarlo, obligo a poner en la posicion 0 o 100 segun nos movamos hacia alante o atras
  changeConfigSlider = (addPosition) => {
    let position = this.marksConfigs.indexOf(this.state.marksRange);
    let nextConfig = this.marksConfigs[position + addPosition];

    let marks = this.configSlider(nextConfig);
    let value = addPosition == 1 ? 0 : 100;

    this.setState(
      {
        marks: marks,
        marksRange: nextConfig,
        value: value
      },
      () => {
        this.changeRETURN(value);
        $('[data-toggle="tooltip"]').tooltip('hide');
      }
    );
  };

  // Configuraciones del slider
  configSlider = (type) => {
    let config = {
      '24h': {
        text: {
          0: '-30 d',
          33: '-7 d',
          66: '-3 d',
          100: '1day'
        },
        values: {
          0: '-29',
          33: '-6',
          66: '-2',
          100: '0'
        }
      },

      rop: {
        text: {
          0: '-72 h',
          50: '-48 h',
          100: '-24 h'
        },
        values: {
          0: '-3',
          50: '-2',
          100: '-1'
        }
      },

      '7d': {
        text: {
          0: '-8 w',
          33: '-4 w',
          66: '-2 w',
          100: '1week'
        },
        values: {
          0: '-55',
          33: '-27',
          66: '-13',
          100: '-6'
        }
      },

      '30d': {
        text: {
          0: '-6 m',
          33: '-3 m',
          66: '-2 m',
          100: '1month'
        },
        values: {
          0: '-6',
          33: '-3',
          66: '-2',
          100: '-1'
        }
      },

      '60m': {
        text: {
          0: '-72 h',
          50: '-48 h',
          100: '-24 h'
        },
        values: {
          0: '-3',
          50: '-2',
          100: '-1'
        }
      }
    };

    return config[type];
  };

  // Modificacion de lo que vamos a devolver
  changeRETURN = (e) => {
    let value = this.getValue(e);
    this.props.onChange(value);
    this.setState({
      value: e
    });
  };

  // Obtener valor
  getValue(mark) {
    return {
      value: this.state.marks.values[mark],
      mark: mark,
      range: this.state.marksRange
    };
  }

  render() {
    let { marks, marksRange, value } = this.state;
    let { props } = this;
    let { marksConfigs } = this;

    let valueSlider = value === null ? Number(_.invert(marks['values'])[props.startValue.value]) : value;

    return (
      <div className="granularity-slider btn-group-main">
        {/* Last Button */}
        <button
          className="btn btn-default btn-left"
          disabled={marksRange == this.marksConfigs[0] || props.disabled}
          onClick={() => this.changeConfigSlider(-1)}
          data-toggle="tooltip"
          data-placement="bottom"
          title="Change granularity"
        >
          {'<<'}
        </button>

        {/* Slider Time */}
        <Slider
          {...props}
          marks={marks.text}
          min={0}
          max={100}
          step={null}
          included={false}
          onChange={this.changeRETURN}
          value={valueSlider}
          defaultValue={valueSlider}
          onAfterChange={this.prueba}
        />

        {/* Next Button */}
        <button
          className="btn btn-default btn-right"
          disabled={marksRange == this.marksConfigs[marksConfigs.length - 1] || props.disabled}
          onClick={() => this.changeConfigSlider(1)}
          data-toggle="tooltip"
          data-placement="top"
          title="Change granularity"
        >
          {'>>'}
        </button>
      </div>
    );
  }
}
