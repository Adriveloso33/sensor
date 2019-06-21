import React from 'react';

import PropTypes from 'prop-types';
import List from '../../../../components/sidebar/components/List';

import { getParentState } from '../../../../helpers/GlobalHelper';

export default class Functions extends React.Component {
  constructor(props) {
    super(props);

    this.listItems = [
      {
        title: 'Addon 1',
        icon: 'wdna-masterlist',
        onClick: this.function1
      },
      {
        title: 'Addon 2',
        icon: 'wdna-alarms',
        onClick: this.function2
      }
    ];
  }

  function1 = () => {};

  function2 = () => {};

  getFilterState = () => {
    const { getFilterInternalState } = getParentState(this);

    let filter = null;

    if (typeof getFilterInternalState === 'function') filter = getFilterInternalState();

    return filter;
  };

  render() {
    return (
      <div className="volte-addons-list">
        <List items={this.listItems} />
      </div>
    );
  }
}

Functions.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired
};
