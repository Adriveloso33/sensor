import React from 'react';
import PropTypes from 'prop-types';
 

import { addTab, removeAll } from '../../../components/tabs/TabsActions';
import New from '../components/New';
import List from '../../../components/sidebar/components/List';

export default class NewElement extends React.Component {
  constructor(props) {
    super(props);
    this.tabId = getStr();
    this.reloadTable = 0;
  }

  componentDidMount() {}

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  notify = () => {
    this.context.updateParent({
      reloadTable: getStr(),
    });
  };

  newRow = () => {
    store.dispatch(removeAll());

    let dataTab1 = {
      id: this.tabId,
      title: 'Add new dashboard',
      active: true,
      component: New,
      props: {
        tabId: this.tabId,
        notify: this.notify,
      },
    };
    store.dispatch(addTab(dataTab1));
  };

  render() {
    return (
      <List
        items={[
          {
            title: 'Add new dashboard',
            icon: 'fa fa-plus',
            mark: false,
            onClick: this.newRow,
          },
        ]}
      />
    );
  }
}

NewElement.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
