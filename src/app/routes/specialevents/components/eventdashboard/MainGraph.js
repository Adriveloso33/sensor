import React from 'react';
import PropTypes from 'prop-types';

import { JarvisWidget } from '../../../../components';
import { errorMessage } from '../../../../components/notifications';

import Loader from '../../../../components/dashboards/components/Loader';
import { checkAuthError } from '../../../../components/auth/actions';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

import HighChartGraph from 'wdna-highchart';
import HC from 'wdna-highchart/lib/libs/HC';
import { graphLegendItemColor, graphParseSeriesNames, getDateFormat } from '../../../../helpers/HighChartHelper';
import pressets from '../../../dashtemplate/pressets/HighChartPressets';

import { getSpecialEventChart } from '../../requests';

export default class MainGraph extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      options: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.setData(this.props.initialFilterState);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      // Listen for main filter changes
      if (nextState.mainFilter != currentState.mainFilter) {
        this.setData(nextState.mainFilter);
      }
    }
  }

  setData = (filter) => {
    const filterWithGraphId = this.addGraphId(filter);

    this.startLoading();
    getSpecialEventChart(filterWithGraphId)
      .then((responseData) => {
        const { data, alias, titles } = responseData;
        this.setState(
          {
            ...responseData,
            data: graphParseSeriesNames(data, alias),
            options: this.getOptions('spline', responseData.groupDateTime, titles),
          },
          this.finishLoading
        );
      })
      .catch((err) => {
        this.finishLoading();
        if (!axios.isCancel(err) && !checkAuthError(err)) errorMessage('Error', 'Error while retrieving in graph data');
      });
  };

  addGraphId = (filter) => {
    const filterCopy = _.cloneDeep(filter);
    const { id_graph = 0 } = this.props;

    return { ...filterCopy, id_graph };
  };

  getOptions = (graphType = 'spline', groupDateTime, titles = {}) => {
    const options = _.cloneDeep(pressets[graphType]);
    const hc = new HC(options, {});

    hc.setOption('title.text', titles.main);
    hc.setOption('subtitle.text', '');

    const { getChartData } = this;
    hc.setOption('legend.labelFormatter', function() {
      const { name } = this;

      const data = getChartData();
      const color = graphLegendItemColor(name, data);

      return `<span style="color: ${color}">${name}</span>`;
    });

    const dateFormat = getDateFormat(groupDateTime);
    hc.setXaxisFormat(dateFormat.axisX);

    return options;
  };

  getChartData = () => {
    const { data } = this.state || {};
    return data;
  };

  startLoading = () => {
    this.setState({
      loading: true,
    });

    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    this.setState({
      loading: false,
    });

    store.dispatch(finishProcess(this.pid));
  };

  render() {
    const { data, options, loading, titles = {} } = this.state;

    return (
      <JarvisWidget
        editbutton={false}
        togglebutton={false}
        editbutton={false}
        fullscreenbutton={true}
        colorbutton={false}
        deletebutton={false}
        custombutton={true}
      >
        <header>
          <span className="widget-icon">
            <i className="fa fa-bar-chart-o" />
          </span>
          <h2>{titles.box}</h2>
        </header>
        <div className="widget-body" ref="widget_body">
          <Loader show={loading} />
          {data && options && (
            <HighChartGraph
              data={data}
              options={options}
              mapInstance={this.mapInstance}
              liveLines={true}
              liveLabels={true}
              settings={true}
              regressionLines={true}
              connectNulls={true}
            />
          )}
        </div>
      </JarvisWidget>
    );
  }
}

MainGraph.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
