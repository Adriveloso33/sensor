import React from 'react';

import Dashboard from '../../../components/dashboards/components/Dashboard';
import dashboardHoc from '../../../components/dashboards/components/DashboardHoc';
import { config } from '../../../config/config';
import { default as NewComponent } from '../components/New';

const apiUrl = config.apiRootUrl;
const summaryUrl = `${apiUrl}/entropy/panel/config`;

const dashConfig = [
  {
    widths: [12, 12, 12],
    type: 'graph',
    title: 'Alarms Graph',
    url: summaryUrl
  }
];

export default class New extends React.Component {
  constructor(props) {
    super(props);

    this.dashComponents = false;
  }

  componentWillMount() {
    this.loadComponents();
  }

  loadComponents = () => {
    let cmps = [];

    cmps.push(this.getMainView());

    this.dashComponents = cmps;

    this.Cmp = dashboardHoc(this.getMainDashboard());
  };

  getMainView = (params) => {
    const { title } = this.props;
    return (props) => <NewComponent {...props} {...params} title={title} />;
  };

  getMainDashboard = (props) => {
    const dash = (props) => <Dashboard components={this.dashComponents} config={dashConfig} />;

    return [dash];
  };

  render() {
    const { Cmp } = this;

    return <Cmp />;
  }
}
