import React from 'react';
import PropTypes from 'prop-types';

import { addTab } from '../../../../components/tabs/TabsActions';
import Form from '../../containers/users/Form';

export default class Functions extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.tabId = getStr();
  }

  newRow = (e) => {
    e.preventDefault();

    let dataTab1 = {
      id: this.tabId,
      title: 'Add new User',
      active: true,
      component: Form,
      props: {
        tabId: this.tabId,
        userId: null,
      },
    };
    store.dispatch(addTab(dataTab1));
  };

  render() {
    return (
      <div id="sidebar-elem-container">
        <div className="volte-addons-list">
          <div className="row" style={{ marginBottom: '10px', marginLeft: '10px' }}>
            <div className="custom-list">
              <ul>
                <li className="">
                  <a onClick={this.newRow}>
                    <span style={{ display: 'pointer' }} className="mb-5">
                      <i className="fa fa-plus" /> New User
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Functions.contextTypes = {
  parentState: PropTypes.object.isRequired,
  updateParent: PropTypes.func.isRequired,
};
