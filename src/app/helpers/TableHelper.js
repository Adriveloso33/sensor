import { getParentItem } from './GlobalHelper';
import { sortSingleSerie } from './HighChartHelper';

/**
 * Returns the color of a value based on the thresholds
 *
 * @param {Number} value
 * @param {String} colId
 * @param {Object} thresholds
 */
export function getCellIconColor(value, colId = '', thresholds = {}) {
  let itemColor = null;

  if (thresholds[colId]) {
    const ranges = thresholds[colId];

    ranges &&
      ranges.forEach((r) => {
        const { min, max, color } = r;

        if (min && max && value >= min && value <= max) itemColor = color;
        if (!min && value <= max) itemColor = color;
        if (!max && value >= min) itemColor = color;
      });
  }

  return itemColor;
}

/**
 * Custom Cell render for Entropy tables
 *
 * @param {Object} params
 */
export function numericCellRender(thresholds = {}, params) {
  const { value, data } = params;
  const { colId } = params.column;

  if (isNaN(value) || value === null) return value || 'null';

  const num = parseFloat(value);
  const color = getCellIconColor(num, colId, thresholds);

  const rawValue = data[colId];
  if (color) {
    return `<span>${rawValue} <i class="fa fa-circle" style="color:${color}"></i></span>`;
  }

  return `<span>${rawValue}</span>`;
}

/**
 * Custom Cell render for colorized categories
 * ex:
 * COL_1: [
 *  {
 *    text: 'CATEGORY 1',
 *    color: '#fff'
 *  },
 *  ......
 * ];
 *
 * @param {Object} params
 */
export function categoriesColorsCellRender(columnCategories = {}, params) {
  const { value } = params;
  const { colId } = params.column;

  if (!columnCategories[colId]) return String(value);

  const categories = columnCategories[colId];
  const searchedItem = categories.find((item) => item.text == value);

  if (!searchedItem) return String(value);

  return `<span style="color:${searchedItem.color}">${value}</span>`;
}

/**
 * Returns the default date column id based on the groupDateTime (granularity) of
 * the Main Filter
 *
 * @param {Object} mainFilter Main filter configuration
 * @returns {String} colId
 */
export function getDateColumnId(mainFilter) {
  const { groupDateTime } = mainFilter || {};
  let colId = 'DATE';

  switch (groupDateTime) {
    case '7d':
      colId = 'WEEK';
      break;
    case '30d':
      colId = 'MONTH';
      break;
    case '24h':
      colId = 'DATE';
      break;
    default:
      break;
  }

  return colId;
}

/**
 * Return a date for Highcharts with a specific format based on the granularity
 *
 * @param {Date} date
 * @param {String} granularity
 */
export function parseDateToGraph(date, granularity) {
  let newDate = null;

  switch (granularity) {
    case 'WEEK':
      newDate = moment.utc(date, 'YYYY-WW').format('x');
      break;
    case 'MONTH':
      newDate = moment.utc(date, 'YYYY-MM').format('x');
      break;
    case 'DATE':
      newDate = moment.utc(date, 'YYYY-MM-DD').format('x');
      break;
    case 'HOURLY':
      newDate = moment.utc(date, 'YYYY-MM-DD HH:mm').format('x');
      break;
  }

  return newDate ? parseInt(newDate) : '';
}

/**
 * Returns coldId by alias
 *
 * @param {String} alias
 * @param {Object} aliasObj
 */
export function getColumnIdbyAlias(alias, aliasObj) {
  let colId = '';

  for (let key in aliasObj) {
    let value = aliasObj[key];
    if (value === alias) colId = key;
  }

  return colId;
}

/**
 * Returns the filterBy Entropy tables property
 *
 * @param {Object} _this
 */
export function getFilterBy(_this) {
  if (_this.filterBy) return _this.filterBy;

  const { filterBy } = _this.props || {};
  const { alias_id } = _this.state || {};

  let colId = '';
  for (let key in alias_id) {
    let value = alias_id[key];
    if (value === filterBy) colId = key;
  }

  return colId;
}

/**
 * Returns the item text of the context menu of the tables
 *
 * @param {Object} _this
 * @param {Object} params
 */
export function getContextMenuName(_this, params) {
  const { node } = params || {};
  const { data } = node || {};
  const filterBy = getFilterBy(_this);

  return data[filterBy] || '';
}

/**
 * Returns a Highchars serie of the column passed in params
 *
 * @param {Object} _this
 * @param {Object} params
 * @param {Number} axisNumber
 * @returns {Array} serie
 */
export function parseSerieToChart(_this, params, serieType = 'spline', axisNumber = 0) {
  const { colId } = params.column;

  const mainFilter = getParentItem(_this, 'mainFilter');
  const { groupDateTime } = mainFilter || {};

  if (groupDateTime === '60m' || groupDateTime === 'rop')
    return parseHourlySerieToChart(_this, params, serieType, axisNumber);

  const { alias_id } = _this.state || {};

  const { headerName } = params.column.colDef;

  let dateAlias = getDateColumnId(mainFilter);
  let dateColumn = getColumnIdbyAlias(dateAlias, alias_id);
  let contexName = getContextMenuName(_this, params);
  let serieName = contexName ? `${headerName}_${contexName}` : headerName;
  let filterBy = getFilterBy(_this);
  let hcData = [];

  const { data } = _this.state || {};
  data &&
    data.forEach((row) => {
      let date = parseDateToGraph(row[dateColumn], dateAlias);
      let value = parseFloat(row[colId]);
      if (value === NaN) value = null;

      if (!filterBy || row[filterBy] == contexName) {
        hcData.push([date, value]);
      }
    });

  let serie = {
    name: serieName,
    type: serieType,
    data: hcData,
    yAxis: axisNumber,
    zIndex: serieType == 'spline' ? 2 : 1,
  };

  sortSingleSerie(serie);

  return [serie];
}

/**
 * Returns a Highchars serie of the column passed in params filter by hourly granularity
 *
 * @param {Object} _this
 * @param {Object} params
 * @param {Number} axisNumber
 * @returns {Array} serie
 */
export function parseHourlySerieToChart(_this, params, serieType = 'spline', axisNumber = 0) {
  const { colId } = params.column;
  const DATE_COLUMN = 'COL_1';
  const TIME_COLUMN = 'COL_2';
  const dateAlias = 'HOURLY';

  const { headerName } = params.column.colDef;
  let filterBy = getFilterBy(_this);
  let contexName = getContextMenuName(_this, params);
  let serieName = contexName ? `${headerName}_${contexName}` : headerName;
  let hcData = [];

  const { data } = _this.state || {};
  data &&
    data.forEach((row) => {
      const date = row[DATE_COLUMN];
      const time = row[TIME_COLUMN];
      const dateAsString = `${date} ${time}`;

      const parsedDate = parseDateToGraph(dateAsString, dateAlias);
      let value = parseFloat(row[colId]);
      if (value === NaN) value = null;

      if (!filterBy || row[filterBy] == contexName) {
        hcData.push([parsedDate, value]);
      }
    });

  const serie = {
    name: serieName,
    type: serieType,
    data: hcData,
    yAxis: axisNumber,
    zIndex: serieType == 'spline' ? 2 : 1,
  };

  sortSingleSerie(serie);

  return [serie];
}
