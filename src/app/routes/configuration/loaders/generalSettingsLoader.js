import React from 'react';


import { addTab, removeAll } from '../../../components/tabs/TabsActions';
 

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
    store.dispatch(removeAll());

    // SETUP DATA FOR NEW TABS
    let dataTab1 = {
      id: getStr(),
      title: 'All Users List',
      component: ListAll,
      props: {},
      active: true,
      route: '',
      sidebar: [Addons]
    };

    store.dispatch(addTab(dataTab1));
  };

  render() {
    return null;
  }
}
