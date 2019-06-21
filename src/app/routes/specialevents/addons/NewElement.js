import React from 'react';
import PropTypes from 'prop-types';

import { addTab } from '../../../components/tabs/TabsActions';

import MainForm from '../components/specialeventform/MainForm';
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
    let dataTab1 = {
      id: this.tabId,
      title: 'Add Special Event',
      active: true,
      component: MainForm,
      props: {
        tabId: this.tabId,
        newSPE: true,
      },
    };
    store.dispatch(addTab(dataTab1));
  };

  render() {
    return (
      <List
        items={[
          {
            title: 'Add Special Event',
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
