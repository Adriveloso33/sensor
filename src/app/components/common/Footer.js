/**
 * Created by griga on 11/24/15.
 */

import React from 'react';

const currentVersion = require('../../../../package.json').version;

export default class Footer extends React.Component {
  render() {
    return (
      <div className="page-footer">
        <div className="row">
          <div className="col-12">
            <span>{`Entropy ${currentVersion} © 2017-2019`}</span>
          </div>
        </div>
      </div>
    );
  }
}
