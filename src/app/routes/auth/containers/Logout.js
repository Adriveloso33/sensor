import React from 'react';

import { logoutUser } from '../../../components/auth/actions';

const CacheHandler = require('../../../helpers/requests/CacheHandler');

export default class Logout extends React.Component {
  componentDidMount() {
    CacheHandler.resetCache();
    logoutUser()
      .then(() => {
        this.props.history.push('/login');
      })
      .catch(() => {
        this.props.history.push('/login');
      });
  }

  render() {
    return null;
  }
}
