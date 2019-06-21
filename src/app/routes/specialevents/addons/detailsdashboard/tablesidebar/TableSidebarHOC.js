import React from 'react';

import MainFilters from './mainfilter/MainFilters';
import Functions from './Functions';

const sidebarElements = [MainFilters, Functions];

const TableSidebar = (props = {}) => {
  return sidebarElements.map((Component, index) => <Component key={index} {...props} />);
};

export default TableSidebar;
