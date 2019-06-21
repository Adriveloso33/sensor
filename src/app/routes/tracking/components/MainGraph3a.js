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

export default class MainGraph3a extends React.Component {
  constructor(props) {
    super(props);
    this.pid = getStr();
    this.state = {
      data: false,
      options1: false,
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
    //grafh 1
    userbyarea(trackingData)
      .then((resp) => {
        let data = resp;
        //console.log('userbyarea', data);
        this.setOptions1('pie');
        this.setState({
          userbyarea: data
        });
        this.finishLoading();
      })
      .catch((error) => {
        //console.log('userbyarea', error);
        let errorMsg = getErrorMessage(error);
        errorMessage('Error', errorMsg);
        this.loading = false;
        this.finishLoading();
      });
  };

  setOptions1 = (graphType = 'pie') => {
    let options1 = _.cloneDeep(pressets[graphType]);

    let hc = new HC(options1, {});

    hc.setOption('title.text', 'Users by Area' || '');
    hc.setOption('subtitle.text', '' || '');
    //hc.setOption('plotOptions.pie.dataLabels.format', '<b>{point.name}</b>: {point.y}');
    this.setState({
      options1
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
    let { userbyarea, ussage, options1, options2 } = this.state;
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

          {userbyarea &&
            options1 && <HighChartGraph name="main_graph" data={userbyarea || emptyData} options={options1} />}
        </div>
      </JarvisWidget>
    );
  }
}

MainGraph3a.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired
};
