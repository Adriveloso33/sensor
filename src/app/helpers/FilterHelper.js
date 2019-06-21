import _ from 'lodash';

export function cleanFilter(filter, allowedItems = []) {
  if (!filter) return null;

  const cleanedFilter = {};

  Object.keys(filter).forEach((itemName) => {
    const isAllowed = allowedItems.indexOf(itemName) !== -1;
    if (!isAllowed) return null;

    const itemValue = filter[itemName];
    cleanedFilter[itemName] = itemValue;
  });

  return _.cloneDeep(cleanedFilter);
}

// this is for analytics section
export const filterTypes = {
  table: {
    title: 'Table',
    type: 'table',
  },
  chart: {
    title: 'Graph simple',
    type: 'graph',
  },
  chartcompare: {
    title: 'Graph comparison',
    type: 'graph',
  },
  charteachelement: {
    title: 'Graph each element',
    type: 'graph',
  },
  multitrend: {
    title: 'Graph multitrend',
    type: 'graph',
  },
  delta: {
    title: 'Delta',
    type: 'delta',
  },
};

export const granularitiesList = [
  {
    text: 'Monthly',
    id: '30d',
  },
  {
    text: 'Weekly',
    id: '7d',
  },
  {
    text: 'Daily',
    id: '24h',
  },
  {
    text: 'Hourly',
    id: '60m',
  },
  {
    text: 'Rop',
    id: 'rop',
  },
];

export const tableGranularityList = [
  {
    text: 'Monthly',
    id: '30d',
  },
  {
    text: 'Weekly',
    id: '7d',
  },
  {
    text: 'Daily',
    id: '24h',
  },
  {
    text: 'All Period Aggregate',
    id: '0m',
  },
  {
    text: 'Hourly',
    id: '60m',
  },
  {
    text: 'Rop',
    id: 'rop',
  },
];

export const busyHourGranularitiesList = [
  {
    text: 'Hourly',
    id: '60m',
  },
];

export function getSliderDefaultLastDayValue(groupDateTime) {
  let config = {
    '24h': {
      text: {
        0: '-30 d',
        33: '-7 d',
        66: '-3 d',
        100: '1day',
      },
      values: {
        0: '-29',
        33: '-6',
        66: '-2',
        100: '0',
      },
    },
    rop: {
      text: {
        0: '-72 h',
        50: '-48 h',
        100: '-24 h',
      },
      values: {
        0: '-3',
        50: '-2',
        100: '-1',
      },
    },

    '7d': {
      text: {
        0: '-8 w',
        33: '-4 w',
        66: '-2 w',
        100: '1week',
      },
      values: {
        0: '-55',
        33: '-27',
        66: '-13',
        100: '-6',
      },
    },

    '0m': {
      text: {
        0: '-30 d',
        33: '-7 d',
        66: '-3 d',
        100: '1day',
      },
      values: {
        0: '-29',
        33: '-6',
        66: '-2',
        100: '0',
      },
    },

    '30d': {
      text: {
        0: '-6 m',
        33: '-3 m',
        66: '-2 m',
        100: '1month',
      },
      values: {
        0: '-6',
        33: '-3',
        66: '-2',
        100: '-1',
      },
    },

    '60m': {
      text: {
        0: '-72 h',
        50: '-48 h',
        100: '-24 h',
      },
      values: {
        0: '-3',
        50: '-2',
        100: '-1',
      },
    },
  };

  return config[groupDateTime].values[100];
}
