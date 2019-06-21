import React from 'react';
import Dashboard from '../../../components/dashboards/components/Dashboard';
import dashboardHoc from '../../../components/dashboards/components/DashboardHoc';
import MainGraph1a from '../components/MainGraph1a';
import MainGraph1b from '../components/MainGraph1b';
import MainGraph2a from '../components/MainGraph2a';
import MainGraph2b from '../components/MainGraph2b';
import MainGraph3a from '../components/MainGraph3a';
import MainGraph3b from '../components/MainGraph3b';
import MainGraph4 from '../components/MainGraph4';
/* sidbar addons */
import Functions from '../addons/Functions';

const dashConfig = [
  {
    widths: [6, 6, 6],
    type: 'graph1a',
    title: 'Queries Evolution'
  },
  {
    widths: [6, 6, 6],
    type: 'graph1b',
    title: 'Access to Entropy'
  },

  {
    widths: [6, 6, 6],
    type: 'graph2a',
    title: 'Access by Area'
  },

  {
    widths: [6, 6, 6],
    type: 'graph2b',
    title: 'Access by User/Area'
  },
  {
    widths: [12, 12, 12],
    type: 'graph3a',
    title: 'Users by Area'
  },
  {
    widths: [12, 12, 12],
    type: 'graph3b',
    title: 'Module Usage (Top 10) '
  },
  {
    widths: [12, 12, 12],
    type: 'graph4',
    title: 'Queries by user (Top 20)'
  }
];

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.dashComponents = false;
  }

  componentWillMount() {
    this.loadComponents();
  }

  loadComponents = () => {
    let cmps = [];

    dashConfig &&
      dashConfig.forEach((cmpConfig) => {
        let { type } = cmpConfig || {};

        switch (type) {
          case 'graph1a':
            cmps.push(this.getGraph1a(cmpConfig));
            break;
          case 'graph1b':
            cmps.push(this.getGraph1b(cmpConfig));
            break;
          case 'graph2a':
            cmps.push(this.getGraph2a(cmpConfig));
            break;
          case 'graph2b':
            cmps.push(this.getGraph2b(cmpConfig));
            break;
          case 'graph3a':
            cmps.push(this.getGraph3a(cmpConfig));
            break;
          case 'graph3b':
            cmps.push(this.getGraph3b(cmpConfig));
            break;
          case 'graph4':
            cmps.push(this.getGraph4(cmpConfig));
            break;

          default:
            break;
        }
      });

    this.dashComponents = cmps;

    this.Cmp = dashboardHoc(this.getMainDashboard(), this.getSideBar());
  };

  getGraph1a = (params) => {
    return (props) => <MainGraph1a {...props} {...params} />;
  };

  getGraph1b = (params) => {
    return (props) => <MainGraph1b {...props} {...params} />;
  };

  getGraph2a = (params) => {
    return (props) => <MainGraph2a {...props} {...params} />;
  };

  getGraph2b = (params) => {
    return (props) => <MainGraph2b {...props} {...params} />;
  };

  getGraph3a = (params) => {
    return (props) => <MainGraph3a {...props} {...params} />;
  };

  getGraph3b = (params) => {
    return (props) => <MainGraph3b {...props} {...params} />;
  };

  getGraph4 = (params) => {
    return (props) => <MainGraph4 {...props} {...params} />;
  };

  getMainDashboard = (props) => {
    let dash = (props) => <Dashboard components={this.dashComponents} config={dashConfig} />;
    return [dash];
  };

  // sidebar elements array
  getSideBar = () => {
    let MF = (props) => <Functions />;
    return [MF];
  };

  render() {
    let { Cmp } = this;

    return <Cmp />;
  }
}
