import React from 'react';

import dashboardHoc from '../../../components/dashboards/components/DashboardHoc';

import { default as ListComponent } from '../components/List';
/* sidbar addons */
import NewElement from '../addons/NewElement';

export default class List extends React.Component {
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

    this.Cmp = dashboardHoc(this.getMain(), this.getSideBar());
  };

  getMain = (props) => {
    let dash = (props) => <ListComponent />;
    return [dash];
  };

  // sidebar elements array
  getSideBar = () => {
    let MF = (props) => <NewElement />;
    return [MF];
  };

  render() {
    let { Cmp } = this;

    return <Cmp />;
  }
}
