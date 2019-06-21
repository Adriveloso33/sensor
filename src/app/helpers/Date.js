import moment from 'moment';

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export const DEFAULT_TIME_FORMAT = 'HH:mm';

export const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

export const DEFAULT_OPTIONS = {
  mode: 'single',
  dateFormat: DEFAULT_DATE_FORMAT,
  granularity: '24h',
  periodToSubstract: { days: 0, months: 0, weeks: 0 },
  periodToAdd: { days: 0, months: 0, weeks: 0 },
};

const ERROR = {
  WRONG_OPTIONS_MODE: "Wrong mode for parser options, allowed are ['single', 'multiple', 'range']",
  WRONG_DATES_ARRAY: 'Wrong dates array passed',
  WRONG_OPTIONS_OBJECT: 'Wrong options object passed',
};

/**
 * Returns an array with the dates parsed with the options passed
 *
 * @param {Array} dates Array of single dates
 * @param {Object} options Parser options
 * @returns {Array} Array of dates objects in the below format
 *                    { cmp1: ">=", date1: "XXXX-MM-DD", cmp2: "<=", date2: "XXXX-MM-DD"}
 */
export function parseDates(dates = [], options = DEFAULT_OPTIONS) {
  const optionsWithDefaultValues = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const { mode } = optionsWithDefaultValues;
  if (mode === 'single') return parseSingleDates(dates, optionsWithDefaultValues);
  if (mode === 'range') return parseRangeDates(dates, optionsWithDefaultValues);
  if (mode === 'multiple') return parseSingleDates(dates, optionsWithDefaultValues);

  throw new Error(ERROR.WRONG_OPTIONS_MODE);
}

export function parseSingleDates(dates, options) {
  if (!dates || dates.length === 0) throw new Error(ERROR.WRONG_DATES_ARRAY);
  if (!options) throw new Error(ERROR.WRONG_OPTIONS_OBJECT);

  return dates.map((singleDate) => transformToDateObject(singleDate, options));
}

function transformToDateObject(date, options) {
  const dateObject = createDateTimeObject();
  const { dateFormat, granularity, periodToSubstract, periodToAdd } = options;

  // calculate the dates
  switch (granularity) {
    case '7d':
      dateObject.date2 = moment(date)
        .endOf('isoWeek')
        .add(periodToAdd)
        .format(dateFormat);
      dateObject.date1 = moment(dateObject.date2)
        .startOf('isoWeek')
        .add(periodToSubstract)
        .format(dateFormat);
      break;

    case '30d':
      dateObject.date2 = moment(date)
        .endOf('month')
        .add(periodToAdd)
        .format(dateFormat);
      dateObject.date1 = moment(dateObject.date2)
        .startOf('month')
        .add(periodToSubstract)
        .format(dateFormat);
      break;

    default:
      dateObject.date2 = moment(date)
        .add(periodToAdd)
        .format(dateFormat);
      dateObject.date1 = moment(date)
        .add(periodToSubstract)
        .format(dateFormat);
      break;
  }

  return dateObject;
}

export function parseRangeDates(dates, options) {
  if (!dates || dates.length === 0) throw new Error(ERROR.WRONG_DATES_ARRAY);
  if (!options) throw new Error(ERROR.WRONG_OPTIONS_OBJECT);

  const { dateFormat } = options;

  const dateObject = createDateTimeObject(dates[0], dates[1]);
  dateObject.date1 = moment(dateObject.date1).format(dateFormat);
  dateObject.date2 = moment(dateObject.date2).format(dateFormat);

  return [dateObject];
}

export function createDateTimeObject(date1 = null, date2 = null) {
  return {
    cmp1: '>=',
    date1,
    cmp2: '<=',
    date2,
  };
}

/* TODO: refactor below this line */

// export function sortDatesList(datesList, order = 'ASC') {
//   if (!datesList || !Array.isArray(datesList)) return null;

//   datesList.sort(compareDates.bind(this, order));

//   return datesList;
// }

// /**
//  * Compare two dates objects in Entropy Format
//  * date1, date2, cmp1, cmp2, etc.
//  * according to date2 field
//  */
// function compareDates(order, dateA, dateB) {
//   if (order === 'ASC') {
//     return moment(dateA.date2).isAfter(moment(dateB.date2));
//   }

//   // is DESC
//   return moment(dateA.date2).isBefore(moment(dateB.date2));
// }

// function reduceToTimeIntervals(timeList) {
//   const sortedTimeList = sortTimeList(timeList);
//   const intervals = [];

//   let step = 0;
//   let start = sortedTimeList[0];
//   let end = sortedTimeList[0];

//   while (step < sortedTimeList.length) {
//     step++;
//     const nextHour = parseInt(getHourFromTime(sortedTimeList[step]));
//     const currentHour = parseInt(getHourFromTime(end));

//     // if is consecutive go next
//     if (currentHour + 1 === nextHour) {
//       end = sortedTimeList[step];
//       continue;
//     }

//     // if not store current interval and go next
//     intervals.push({ start, end });
//     start = end = sortedTimeList[step];
//   }

//   return intervals;
// }

// function sortTimeList(timeList) {
//   return timeList.sort((timeA, timeB) => {
//     const hourA = parseInt(getHourFromTime(timeA));
//     const hourB = parseInt(getHourFromTime(timeB));
//     return hourA - hourB;
//   });
// }

// function parseIntervalsList(intervalList) {
//   return intervalList.map((interval) => {
//     try {
//       const time1 = getHourFromTime(interval.start);
//       const time2 = getHourFromTime(interval.end);

//       return {
//         cmp1: '>=',
//         time1,
//         cmp2: '<=',
//         time2,
//       };
//     } catch (Ex) {
//       console.warn('Invalid hour format');
//       return null;
//     }
//   });
// }

// function getHourFromTime(time = '00:00') {
//   return moment(time, TimeFormat).format('H');
// }

// export function parserTime(timeList, groupDateTime) {
//   if (timeList === 'all') return undefined;
//   if (!Array.isArray(timeList)) return undefined;
//   if (timeList.length === 24 || timeList.length === 0) return undefined;

//   const isInvalidGranularity = !groupDateTime || (groupDateTime !== '60m' && groupDateTime !== 'rop');
//   if (isInvalidGranularity) return undefined;

//   const timeIntervals = reduceToTimeIntervals(timeList);

//   return parseIntervalsList(timeIntervals);
// }
