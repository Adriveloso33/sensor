import React from 'react';

import dashboardHoc from '../../../components/dashboards/components/DashboardHoc';
import ListAll from '../components/ListAll';

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

    this.dashComponents = cmps;

    this.Cmp = dashboardHoc(this.getMain());
  };

  getMain = (props) => {
    let dash = (props) => <ListAll />;
    return [dash];
  };

  render() {
    let { Cmp } = this;

    return <Cmp />;
  }
}
