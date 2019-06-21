import React from 'react';

import Dashboard from './Dashboard';
import dashboardHoc from './DashboardHoc';

class DashboardLauncher extends React.Component {
  mainComponentsArray = [];

  mainView = null;

  componentWillMount() {
    this.setUpMainComponents();
    this.setUpDashboardHoc();
  }

  setUpMainComponents = () => {
    const { config } = this.props;
    if (!config || !Array.isArray(config)) return;

    this.mainComponentsArray = config.map(itemConfig => this.getComponentFromConfig(itemConfig));
  };

  getComponentFromConfig = (itemConfig) => {
    const Component = itemConfig.component;
    const Props = itemConfig.props;

    return props => <Component {...props} {...this.props} {...Props} />;
  };

  setUpDashboardHoc = () => {
    const dashboard = this.getMainDashboard();
    const { sidebar, hiddenSidebar } = this.props;

    this.mainView = dashboardHoc(dashboard, sidebar, hiddenSidebar);
  };

  getMainDashboard = () => {
    const { config = [] } = this.props;
    const dashboard = () => <Dashboard components={this.mainComponentsArray} config={config} />;

    return [dashboard];
  };

  render() {
    const FullDashboard = this.mainView;
    return <FullDashboard />;
  }
}

export default DashboardLauncher;
