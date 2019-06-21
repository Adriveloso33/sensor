import React from 'react';

import MainFilter from './mainfilter/MainFilters';
import Functions from './Functions';
import Addons from './Addons';

const sidebarElements = [MainFilter];

const GraphSidebar = (props = {}) => {
  return sidebarElements.map((Component, index) => <Component key={index} {...props} />);
};

export default GraphSidebar;
