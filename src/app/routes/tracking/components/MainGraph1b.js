import React from 'react';
import PropTypes from 'prop-types';
import { JarvisWidget } from '../../../components';
import { errorMessage, warningMessage } from '../../../components/notifications';
import { getErrorMessage } from '../../../components/utils/ResponseHandler';
import Loader from '../../../components/dashboards/components/Loader';
import { initProcess, finishProcess } from '../../../components/scheduler/SchedulerActions';

 
import HighChartGraph from 'wdna-highchart';
import HC from 'wdna-highchart/lib/libs/HC';

import {
  getQueryEvolution,
  accesstoentropy,
  accessbyarea,
  accessbyuserarea,
  userbyarea,
  ussage,
  querybyuser
} from '../requests/index';
import pressets from '../pressets/HighChartPressets';

const emptyData = [
  {
    name: 'No data',
    data: [],
    type: 'spline'
  }
];

export default class MainGraph1b extends React.Component {
  constructor(props) {
    super(props);

    this.pid = getStr();

    this.state = {
      data: false,

      options2: false,
      loading: false
    };
  }

  componentWillReceiveProps(nextProps, nextContex) {
    if (nextContex != this.context) {
      let nextState = nextContex.parentState || {};
      let currentState = this.context.parentState || {};

      if (nextState.trackingData != currentState.trackingData) {
        //console.log(nextState.trackingData);
        this.load(nextState.trackingData);
      }
    }
  }

  load = (trackingData) => {
    this.loading = true;
    this.startLoading();

    //grafh 2
    accesstoentropy(trackingData)
      .then((resp) => {
        let { data } = resp;
        // console.log('accesstoentropy', data);
        this.setOptions2('spline');
        this.setState({
          accesstoentropy: data
        });
        this.finishLoading();
      })
      .catch((error) => {
        //console.log('accesstoentropy', error);
        let errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.loading = false;
        this.finishLoading();
      });
  };

  setOptions2 = (graphType = 'spline') => {
    let options2 = _.cloneDeep(pressets[graphType]);

    let hc = new HC(options2, {});

    hc.setOption('title.text', 'Access to Entropy' || '');
    hc.setOption('subtitle.text', '' || '');

    this.setState({
      options2
    });
  };

  mapInstance = (chart) => {
    // finish loading
    this.finishLoading();
  };

  startLoading = () => {
    this.setState({
      loading: true
    });

    store.dispatch(initProcess(this.pid));
  };

  finishLoading = () => {
    this.setState({
      loading: false
    });

    store.dispatch(finishProcess(this.pid));
  };

  render() {
    let { accesstoentropy, options2 } = this.state;
    let { props } = this;

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
          <Loader show={this.state.loading} />

          {accesstoentropy &&
            options2 && (
              <HighChartGraph
                name="main_graph"
                data={accesstoentropy || emptyData}
                options={options2}
                mapInstance={this.mapInstance}
                regressionLines={true}
              />
            )}
        </div>
      </JarvisWidget>
    );
  }
}

MainGraph1b.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired
};
