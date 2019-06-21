import React from 'react';
import PropTypes from 'prop-types';

import { JarvisWidget } from '../../../../components';
import { errorMessage } from '../../../../components/notifications';
import Loader from '../../../../components/dashboards/components/Loader';
import { checkAuthError } from '../../../../components/auth/actions';

import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';


import HighChartGraph from 'wdna-highchart';
import HC from 'wdna-highchart/lib/libs/HC';
import { graphAddSeries, graphParseSeriesNames, graphLegendItemColor } from '../../../../helpers/HighChartHelper';
import { getVendorName, getParentState } from '../../../../helpers/GlobalHelper';
import pressets from '../../pressets/HighChartPressets';

import { getMainChart } from '../../requests';

export default class MainGraph extends React.Component {
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

      // Listen for new data
      if (nextState.graphNewData != currengetMainCharttState.graphNewData) {
        this.setUpNewData(nextState.graphNewData);
      }

      // Listen for a Serie data for add to current data
      if (nextState.graphSerieData != currentState.graphSerieData) {
        this.addSeries(nextState.graphSerieData);
      }

      // Listen for main filter changes
      if (nextState.mainFilter != currentState.mainFilter) {
        this.setData(nextState.mainFilter);
      }
    }
  }

  /**
   * Get and set graph data from the server
   */
  setData = (filter) => {
    this.startLoading();
    getMainChart(filter)
      .then((response) => {
        const { data, alias } = response;
        this.setState({
          data: graphParseSeriesNames(data, alias),
          options: this.getOptions('spline', filter),
        });
        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        if (!axios.isCancel(err) && !checkAuthError(err)) errorMessage('Error', 'Error while retrieving in graph data');
      });
  };

  getOptions = (graphType = 'column', filter = {}) => {
    let options = _.cloneDeep(pressets[graphType]);
    const hc = new HC(options, {});

    const { vendor_id } = filter;

    const vendor = getVendorName(this, vendor_id);

    hc.setOption('title.text', vendor || '');
    hc.setOption('subtitle.text', null);

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

  clearGraph = () => {
    this.setState({
      data: [],
    });
  };

  reloadGraph = () => {
    const parentState = getParentState(this);
    const { mainFilter } = parentState || {};
    this.setData(mainFilter, true);
  };

  setUpNewData = (data) => {
    this.setState({
      data,
    });
  };

  addSeries = (series, clear = false) => {
    const { data } = this.state || {};
    const newSeries = graphAddSeries(series, data, clear);

    if (newSeries) this.setUpNewData(newSeries);
  };

  render() {
    const { data, options, loading } = this.state;

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
          <h2>Graph</h2>
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
              customMenuItems={[
                {
                  text: 'Clear Graph',
                  onclick: this.clearGraph,
                },
                {
                  text: 'Reload Graph',
                  onclick: this.reloadGraph,
                },
              ]}
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
