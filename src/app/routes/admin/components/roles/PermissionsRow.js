import React from 'react';
import PropTypes from 'prop-types';
import UiAccordion from '../../../../components/ui/UiAccordion';

export function PermissionsRow(props) {
  const { permissionList, group, label } = props;
  const columns = 4;
  let list = [];

  list = permissionList.filter((perm) => perm.group_id === group);
  const total = list.length;
  const elements = [];
  let row = [];

  for (let i = 0; i < total; i++) {
    const perm = list[i];

    row.push(
      <SinglePerm
        key={i}
        name={perm.permission}
        label={perm.label}
        handleChange={props.handleChange}
        checked={perm.checked || false}
      />
    );

    if ((i + 1) % columns === 0) {
      elements.push(
        <div key={i} className="row inline-group">
          {row.slice()}
        </div>
      );

      row = [];
    }
  }

  if (row.length > 0) {
    elements.push(
      <div key={total} className="row inline-group">
        {row.slice()}
      </div>
    );
  }

  return (
    <fieldset>
      <UiAccordion active={false}>
        <div>
          <h4 className="accordion">{label}</h4>

          <div className="accordion">{elements}</div>
        </div>
      </UiAccordion>
    </fieldset>
  );
}

function SinglePerm(props) {
  return (
    <div className="col col-3">
      <label className="checkbox">
        <input
          type="checkbox"
          name={props.name}
          defaultChecked={props.checked === true}
          onChange={props.handleChange}
        />
        <i />
        {props.label}
      </label>
    </div>
  );
}

PermissionsRow.propTypes = {
  permissionList: PropTypes.array,
  label: PropTypes.string,
};

PermissionsRow.defaultProps = {
  permissionList: [],
  label: null,
};
