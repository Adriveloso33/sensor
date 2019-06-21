import React from 'react';

import PropTypes from 'prop-types';
import List from '../../../components/sidebar/components/List';

import { addTab } from '../../../components/tabs/TabsActions';

import New from '../containers/users/New';

export default class UsersAddons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: false,
    };
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    listItems[0].onClick = this.addUser;

    this.setState({
      items: listItems,
    });
  }

  addUser = () => {
    let dataTab1 = {
      id: getStr(),
      title: 'Add New User',
      active: true,
      component: New,
      props: {},
    };

    store.dispatch(addTab(dataTab1));
  };

  render() {
    let { items } = this.state;

    return items ? <List items={items} /> : null;
  }
}

var listItems = [
  {
    title: 'Add New User',
    icon: 'fa fa-plus',
    onClick: () => {
      console.log(this);
    },
  },
];
