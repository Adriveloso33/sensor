import React from 'react';
import Dropdown from '../../forms/inputs/Dropdown';

export default class VendorFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      $('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    }, 0);
  }

  render() {
    const { items, vendor_id, disabled, onChange, handleAdvancedClick } = this.props || {};

    return (
      <div className="row vendor-filter">
        <div className="col-sm-12 btn-group-main">
          <Dropdown
            placeHolder="Select Vendor"
            title="Vendor"
            icon="wdna-vendor"
            onChange={onChange}
            className="entropy-filter"
            disabled={disabled}
            active={vendor_id}
            items={items || []}
          >
            <button
              className="btn btn-default btn-secondary"
              data-toggle="tooltip"
              data-placement="top"
              title="Advanced Filter"
              onClick={handleAdvancedClick}
            >
              <i className="fa fa-filter" />
            </button>
          </Dropdown>
        </div>
      </div>
    );
  }
}
