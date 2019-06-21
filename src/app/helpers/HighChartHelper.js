import { errorMessage, warningMessage } from '../components/notifications';

/* Default colors for Highcharts Y axes */
export const leftAxisColor = 'rgba(255,255,255,1)';
export const rightAxisColor = 'rgba(255,255,255,0.5)';

// Highchart serie compatible format with no data
export const emptyData = [
  {
    name: 'No data',
    data: [],
    type: 'spline',
  },
];

/**
 * Merge the new series with the actual series, returns false if all the new series to
 * merge already exist in the graph
 *
 * @param {Array or Object} series Series to add
 * @param {Array} data Current graph series
 * @param {Boolean} clear If true the new series overwrite the current series
 */
export function graphAddSeries(series, data, clear = false) {
  let inputSeries = [];

  if (Array.isArray(series)) {
    inputSeries = series;
  } else {
    inputSeries = [series];
  }

  const seriesToShow = inputSeries.filter((serie) => {
    const { name } = serie || {};
    if (!clear && graphHaveSerie(name, data)) {
      warningMessage('Warning', `The graph already have the serie: ${name}.`);
      return false;
    }
    return true;
  });

  if (!seriesToShow.length) return false;

  let newData = [];

  if (!clear) {
    newData = data ? data.slice() : [];
  }

  newData = newData.concat(seriesToShow);

  return newData;
}

/**
 * Returns true if a serie already exist on graph
 *
 * @param {String} serieName name of the serie
 * @param {Array} data current series
 */
export function graphHaveSerie(serieName, data) {
  let exist = false;

  data &&
    data.forEach((serie) => {
      exist = exist || serie.name == serieName;
    });

  return exist;
}

/**
 * Returns a new series array with the series with new names
 *
 * @param {Array} data current graph series
 * @param {Object} alias alias for series
 */
export function graphParseSeriesNames(data = [], alias = {}) {
  const newData = data.map((serie) => {
    let { name } = serie;
    let newName = name && alias[name] ? alias[name] : name;

    return {
      ...serie,
      name: newName,
    };
  });

  return newData;
}

export function sortDateSeriesXaxis(serieInfo) {
  if (!serieInfo) return;

  if (Array.isArray(serieInfo)) {
    serieInfo.forEach((serie) => {
      sortSingleSerie(serie);
    });
  } else {
    sortSingleSerie(serieInfo);
  }
}

export function sortSingleSerie(serie = {}) {
  const isAnObject = typeof serie === 'object' && !Array.isArray(serie);

  if (!isAnObject) return;

  const { data = [] } = serie;
  data.sort(comparePointsByDate);
}

function comparePointsByDate(pointA, pointB) {
  return pointA[0] - pointB[0];
}

/**
 * Return the color of the serie based on the yAxis (left:0 or right:1)
 *
 * @param {String} itemName Serie name to colorize
 * @param {Array} data current series
 */
export function graphLegendItemColor(itemName, data) {
  let color = leftAxisColor;

  data &&
    data.forEach((serie) => {
      if (serie.name == itemName && serie.yAxis == 1) {
        color = rightAxisColor;
      }
    });

  return color;
}

export function getDateFormat(groupDateTime) {
  const format = {
    axisX: null,
    value: null,
  };

  switch (groupDateTime) {
    case '60m':
      format.axisX = '{value:%Y/%m/%d %H:%M}';
      format.value = 'YYYY-MM-DD HH:mm';
      break;
    case 'rop':
      format.axisX = '{value:%Y/%m/%d %H:%M}';
      format.value = 'YYYY-MM-DD HH:mm';
      break;
    case '24h':
      format.axisX = '{value:%Y/%m/%d}';
      format.value = 'YYYY-MM-DD';
      break;
    case '7d':
      format.axisX = '{value:%Y/%W}';
      format.value = 'YYYY-W';
      break;
    case '30d':
      format.axisX = '{value:%Y/%m}';
      format.value = 'YYYY-MM';
      break;
    default:
      format.axisX = '{value:%Y/%m/%d}';
      format.value = 'YYYY-MM-DD';
      break;
  }

  return format;
}
