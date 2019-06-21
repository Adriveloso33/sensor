import React from 'react';
import PropTypes from 'prop-types';

import { addTab } from '../../../../components/tabs/TabsActions';
import AppForm from '../../components/apps/AppForm';
import List from '../../../../components/sidebar/components/List';

export default class Functions extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.tabId = getStr();
  }

  notify = () => {
    this.context.updateParent({
      reloadTable: getStr(),
    });
  };

  newRow = () => {
    const dataTab1 = {
      id: this.tabId,
      title: 'Add new App',
      active: true,
      component: AppForm,
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
            title: 'New App',
            icon: 'fa fa-plus',
            mark: false,
            onClick: this.newRow,
          },
        ]}
      />
    );
  }
}

Functions.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
