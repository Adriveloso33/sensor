import React from 'react';
import PropTypes from 'prop-types';
import { JarvisWidget } from '../../../../components';
import { errorMessage, warningMessage } from '../../../../components/notifications';
import Loader from '../../../../components/dashboards/components/Loader';
import { checkAuthError } from '../../../../components/auth/actions';
import Auth from '../../../../components/auth/Auth';
import { initProcess, finishProcess } from '../../../../components/scheduler/SchedulerActions';

import HighChartGraph from 'wdna-highchart';
import HC from 'wdna-highchart/lib/libs/HC';
import { graphAddSeries, graphParseSeriesNames, graphLegendItemColor } from '../../../../helpers/HighChartHelper';
import { getRegionName, getVendorName, getParentState } from '../../../../helpers/GlobalHelper';
import pressets from '../../pressets/HighChartPressets';

export default class MainGraph extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      data: null,
      options: null,
      titles: {},
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext != this.context) {
      let nextState = nextContext.parentState || {};
      let currentState = this.context.parentState || {};

      /* Graph listen states */

      // Listen for main filter changes
      if (nextState.mainFilter != currentState.mainFilter) {
        this.setData(nextState.mainFilter);
      }

      // Listen for new data
      if (nextState.graphNewData != currentState.graphNewData) {
        this.setUpNewData(nextState.graphNewData);
      }

      // Listen for a Serie data for add to current data
      if (nextState.graphSerieData != currentState.graphSerieData) {
        this.addSeries(nextState.graphSerieData);
      }
    }
  }

  /**
   * Get and set graph data from the server
   */
  setData = (filter) => {
    const { url } = this.props || {};
    if (!url) return;

    this.startLoading();
    axios
      .post(
        url,
        {
          api_token: Auth.getToken(),
          ...filter,
        },
        { cancelToken: source.token }
      )
      .then((resp) => {
        const { data } = resp;
        const graphData = data.data;
        const alias = data.alias;

        // redraw all graph with new data
        if (graphData) {
          this.setState({
            data: graphParseSeriesNames(graphData, alias),
            options: this.getOptions('spline', filter, data.titles),
            titles: data.titles,
          });
        } else {
          warningMessage('Warning', 'There is no data for the graph.');
        }
        this.finishLoading();
      })
      .catch((err) => {
        this.finishLoading();
        if (!axios.isCancel(err) && !checkAuthError(err)) errorMessage('Error', 'Error while retrieving in graph data');
      });
  };

  getOptions = (graphType = 'column', filter, titles = {}) => {
    let options = _.cloneDeep(pressets[graphType]);
    const hc = new HC(options, {});

    hc.setOption('title.text', titles.main);
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

  addSeries = (series, clear = false) => {
    const { data } = this.state || {};
    const newSeries = graphAddSeries(series, data, clear);

    if (newSeries) this.setUpNewData(newSeries);
  };

  setUpNewData = (data) => {
    this.setState({
      data,
    });
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
          <h2>{props.title}</h2>
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
