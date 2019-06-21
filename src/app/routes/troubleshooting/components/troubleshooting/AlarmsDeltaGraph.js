import React from 'react';
import PropTypes from 'prop-types';
import { JarvisWidget } from '../../../../components';
import { errorMessage } from '../../../../components/notifications';
import Loader from '../../../../components/dashboards/components/Loader';
import { checkAuthError } from '../../../../components/auth/actions';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

 
import HighChartGraph from 'wdna-highchart';
import HC from 'wdna-highchart/lib/libs/HC';
import { graphParseSeriesNames, graphLegendItemColor } from '../../../../helpers/HighChartHelper';
import { getVendorName } from '../../../../helpers/GlobalHelper';
import pressets from '../../pressets/HighChartPressets';

import { getAlarmsChart, getDeltaChart } from '../../../../requests/entropy';

export default class AlarmsDeltaGraph extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      data: null,
      options: null,
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      const nextState = nextContext.parentState || {};
      const currentState = this.context.parentState || {};

      /* Graph listen states */

      // Listen for main filter changes
      if (nextState.mainFilter != currentState.mainFilter) {
        this.getGraphData(nextState.mainFilter);
      }
    }
  }

  /**
   * Get and set graph data from the server
   */
  getGraphData = (filter) => {
    const requests = [getAlarmsChart(filter), getDeltaChart(filter)];

    this.startLoading();
    Promise.all(requests)
      .then((values) => {
        // redraw all graph with new data
        this.mergeSeries(values, filter);
        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        if (!axios.isCancel(err) && !checkAuthError(err))
          errorMessage('Error', 'Error while retrieving Alarms and Delta graph data');
      });
  };

  mergeSeries = (values, filter) => {
    const alarmsData = values[0];
    const deltaData = values[1];

    const alarmsSerie = graphParseSeriesNames(alarmsData.data, alarmsData.alias);
    const deltaSerie = graphParseSeriesNames(deltaData.data, deltaData.alias);

    this.setYaxisNumber(alarmsSerie, 0);
    this.setYaxisNumber(deltaSerie, 1);

    const data = alarmsSerie.concat(deltaSerie);
    this.setState({
      data,
      options: this.getOptions('spline', filter),
    });
  };

  setYaxisNumber = (series, yAxis = 0) => {
    series &&
      series.forEach((serie) => {
        serie.yAxis = yAxis;
      });
  };

  getOptions = (graphType = 'column', filter) => {
    const options = _.cloneDeep(pressets[graphType]);
    const hc = new HC(options, {});

    const { vendor_id } = filter || {};
    const { region_id } = filter || {};

    const vendor = getVendorName(this, vendor_id);

    hc.setOption('title.text', vendor || '');
    hc.setOption('subtitle.text', null);

    // modify options
    const { getChartData } = this;
    hc.setOption('legend.labelFormatter', function() {
      const { name } = this;

      const data = getChartData();
      const color = graphLegendItemColor(name, data);

      return `<span style="color: ${color}">${name}</span>`;
    });

    return options;
  };

  mapInstance = (chart) => {
    // finish loading
    this.finishLoading();
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
    const { data, options, loading } = this.state;
    const { props } = this;

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
          <h2>Alarms Delta Graph</h2>
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

AlarmsDeltaGraph.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
