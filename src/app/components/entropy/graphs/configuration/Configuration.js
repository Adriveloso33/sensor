import React from 'react';
import SketchColor from '../../../../../components/forms/inputs/Colorselect';
import RotationList from '../../../../../components/list/RotationList';
import WdnaColors from '../../../../../helpers/HighChartColors';

const defaultSerieConfig = {
  type: 'spline',
  yAxis: 'left',
  name: '',
  color: null
};

const exportGraphPropName = 'graphConfiguration';

export default class GraphConfiguration extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      threshold: {}
    };

    this.colorsList = new RotationList(WdnaColors, null, null);
  }

  componentDidMount() {
    const { graphConfiguration } = this.props;
    this.initialize(graphConfiguration);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      const { graphConfiguration } = nextProps;
      this.initialize(graphConfiguration);
    }
  }

  initialize = (initialConfig) => {
    this.setState(
      {
        ...initialConfig
      },
      this.initializeElements
    );
  };

  initializeElements = () => {
    const { kpisInfo = [], countersInfo = [] } = this.props;

    const elements = kpisInfo.concat(countersInfo);

    elements.forEach((element) => {
      const { id } = element;
      if (!this.state[id]) this.initializeSerie(element);
    });
  };

  initializeSerie = (element, cb) => {
    const defaultItemConfig = this.getEmptyItemConfig(element);
    const { id } = element;

    this.setState(
      {
        [id]: defaultItemConfig
      },
      () => {
        if (typeof cb === 'function') cb();
      }
    );
  };

  getEmptyItemConfig = (element) => {
    return {
      ...defaultSerieConfig,
      color: this.getItemColor(),
      name: element.name
    };
  };

  getItemColor = () => {
    const color = this.colorsList.currentItem();
    this.goToNextColor();

    return color;
  };

  goToNextColor = () => {
    this.colorsList.goNext();
  };

  handleInputs = (e) => {
    const { target } = e;
    const { id, name, value } = target || {};

    this.handleChanges(id, name, value);
  };

  handleSelects = (e, id) => {
    const { target } = e;
    const { name, value } = target;

    this.handleChanges(id, name, value);
  };

  handleChanges = (id, key, value) => {
    const itemConfig = _.cloneDeep(this.state[id]);

    if (!itemConfig) {
      const cb = this.handleChanges.bind(this, id, key, value);
      this.initializeSerie(id, cb);
      return;
    }

    // makes changes
    itemConfig[key] = value;
    this.setState(
      {
        [id]: itemConfig
      },
      this.notifyChanges
    );
  };

  getSerieConfig = (item) => {
    const { id } = item || {};

    return this.state[id];
  };

  notifyChanges = () => {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      const graphConfiguration = _.cloneDeep(this.state);

      onChange(exportGraphPropName, graphConfiguration);
    }
  };

  render() {
    const { kpisInfo = [], countersInfo = [], graphConfiguration = {} } = this.props;
    const { value, yAxis, color } = graphConfiguration.threshold || {};

    const elements = kpisInfo.concat(countersInfo);

    return (
      <fieldset>
        <div className="row">
          <section className="col col-sm-8 col-lg-6">
            <table className="table table-striped">
              <thead>
                <tr style={{ textAlign: 'center' }}>
                  <td style={{ width: '100px' }}>KPI/Counter</td>
                  <td style={{ width: '50px' }}>Color</td>
                  <td style={{ width: '50px' }}>Type</td>
                  <td style={{ width: '50px' }}>Y Axis</td>
                </tr>
              </thead>
              <tbody>
                {elements &&
                  elements.map((item) => {
                    const serieConfig = this.getSerieConfig(item);
                    if (!serieConfig) return null;

                    const { name, color, type, yAxis } = serieConfig;
                    const { id } = item;

                    return (
                      <tr style={{ textAlign: 'center' }} key={id}>
                        <td>{name}</td>
                        <td>
                          <SketchColor
                            color={color}
                            name={id}
                            handleChange={(id, value) => {
                              this.handleChanges(id, 'color', value);
                            }}
                          />
                        </td>
                        <td>
                          <select
                            name={`type`}
                            value={type}
                            className="form-control"
                            onChange={(e) => {
                              this.handleSelects(e, id);
                            }}
                          >
                            <option value="spline">Spline</option>
                            <option value="areaspline">Area</option>
                            <option value="column">Column</option>
                            <option value="line">Line</option>
                          </select>
                        </td>
                        <td>
                          <select
                            name={`yAxis`}
                            value={yAxis}
                            className="form-control"
                            onChange={(e) => {
                              this.handleSelects(e, id);
                            }}
                          >
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </section>
          <section className="col col-sm-4 col-lg-2">
            <h3>Add reference line</h3>
            <input
              type="text"
              id="threshold"
              name="value"
              placeholder="Example: 95.6"
              style={{ paddingLeft: '5px', paddingRight: '5px' }}
              className="form-control"
              value={value}
              onChange={this.handleInputs}
            />
            <select
              id="threshold"
              name={`yAxis`}
              value={yAxis}
              style={{ paddingLeft: '5px', paddingRight: '5px', marginTop: '5px' }}
              className="form-control"
              onChange={this.handleInputs}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
            <div style={{ marginTop: '5px' }}>
              <h3>Color: </h3>
              <SketchColor
                id="threshold"
                color={color}
                name={'color'}
                handleChange={(id, value) => {
                  this.handleChanges('threshold', 'color', value);
                }}
              />
            </div>
          </section>
        </div>
      </fieldset>
    );
  }
}
