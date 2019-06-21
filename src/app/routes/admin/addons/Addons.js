import React from 'react';

import List from '../../../components/sidebar/components/List';

export default class Addons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <List items={listItems} />;
  }
}

var listItems = [
  {
    title: 'Filter users',
    icon: 'fa fa-user',
    onClick: () => {
      console.log('clicked');
    },
  },
  {
    title: 'KPI to Counters',
    icon: 'wdna-kpi-counters',
    items: [
      {
        title: 'Meteorology',
        icon: 'wdna-meteorology',
        onClick: () => {
          console.log('clicked');
        },
      },
      {
        title: 'Monetization',
        icon: 'wdna-monetization',
        onClick: () => {
          console.log('clicked');
        },
      },
    ],
  },
];
