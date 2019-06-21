import React from 'react';

import { addTab, removeAll } from '../../../components/tabs/TabsActions';

import UserSettings from '../containers/UserSettings';

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('Montando loader user...');
    this.loadTabs();
  }

  /**
   * Dispatch the default tabs for this route
   */
  loadTabs = () => {
    // SETUP DATA FOR NEW TABS
    let dataTab1 = {
      id: getStr(),
      title: 'My Account',
      active: true,
      component: UserSettings,
      route: '',
      props: {},
    };

    store.dispatch(addTab(dataTab1));
  };

  render() {
    return null;
  }
}
