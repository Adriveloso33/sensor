import React from 'react';


import { addTab, removeAll } from '../../../components/tabs/TabsActions';
 

import List from '../containers/List';

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadTabs();
  }

  /**
   * Dispatch the default tabs for this route
   */
  loadTabs = () => {
    // REMOVE ALL PREVIOUS TABS
    // store.dispatch(removeAll());

    // SETUP DATA FOR NEW TABS
    let dataTab1 = {
      id: getStr(),
      title: 'Tracking',
      active: true,
      component: List,
      route: '',
      props: {}
    };

    store.dispatch(addTab(dataTab1));
  };

  render() {
    return null;
  }
}
