const DateFormat = 'YYYY-MM-DD HH:mm';
const TimeFormat = 'HH:mm';

export function parserDate(_this) {
  const { date, flatpickrMode } = _this.state;

  let dates = [];
  if (flatpickrMode == 'single') dates = [parseSingleDates(_this, date)];
  if (flatpickrMode == 'range') dates = [parseRangeDates(date)];
  if (flatpickrMode == 'multiple') dates = parseMultiplesDates(_this, date);

  return dates;
}

export function parseSingleDates(_this, date) {
  const { lastDays, groupDateTime } = _this.state;

  const dateRange = initRangeDate();

  // calculate the dates
  switch (groupDateTime) {
    case '24h':
      dateRange.date2 = date[0];
      dateRange.date1 = moment(dateRange.date2)
        .add(lastDays, 'days')
        .format(DateFormat);
      break;

    case 'rop':
      dateRange.date2 = date[0];
      dateRange.date1 = moment(dateRange.date2)
        .add(lastDays, 'days')
        .format(DateFormat);
      break;

    case '7d':
      dateRange.date2 = moment(date[0])
        .endOf('week')
        .add(1, 'days');
      dateRange.date1 = moment(dateRange.date2).add(lastDays, 'days');
      break;

    case '30d':
      dateRange.date2 = moment(date[0]).endOf('month');
      dateRange.date1 = moment(dateRange.date2)
        .add(lastDays, 'month')
        .endOf('month')
        .add(1, 'days');
      break;

    case '60m':
      const decimalDay = lastDays % 1;
      const hours = Math.round(decimalDay * 24);

      dateRange.date2 = date[0];
      dateRange.date1 = moment(dateRange.date2)
        .add(lastDays > -1 && lastDays < 1 ? 0 : lastDays, 'days')
        .add(hours, 'hours')
        .format(DateFormat);
      break;

    default:
      dateRange.date1 = date[0];
      dateRange.date2 = date[0];
      break;
  }

  dateRange.date1 = moment(dateRange.date1).format('YYYY-MM-DD');
  dateRange.date2 = moment(dateRange.date2).format('YYYY-MM-DD');

  return dateRange;
}

function initRangeDate() {
  const dateRangeVar = rangeDate(null, null);

  return dateRangeVar;
}

export function rangeDate(date1, date2) {
  const dateRangeVar = {
    cmp1: '>=',
    date1,
    cmp2: '<=',
    date2,
  };

  return dateRangeVar;
}

export function parseRangeDates(dateRange) {
  const outputDate = initRangeDate();

  outputDate.date1 = moment(dateRange[0]).format('YYYY-MM-DD');
  outputDate.date2 = moment(dateRange[1] || dateRange[0]).format('YYYY-MM-DD');

  return outputDate;
}

export function parseMultiplesDates(_this, dateList) {
  if (!dateList) return [];

  const parsedDates = dateList.map((singleDate) => {
    const parsedDate = parseSingleDatesGroupDate(_this, [singleDate]);

    return parsedDate;
  });

  return parsedDates;
}

export function parseSingleDatesGroupDate(_this, date) {
  const { lastDays, addDateTime } = _this.state;

  let dateRange = initRangeDate();

  // calculate the dates
  switch (addDateTime) {
    case '24h':
      dateRange.date2 = date[0];
      dateRange.date1 = date[0];
      break;

    case '7d':
      dateRange.date2 = moment(date[0]).add(6, 'days');
      dateRange.date1 = moment(date[0]);
      break;

    case '30d':
      dateRange.date2 = moment(date[0])
        .add(1, 'month')
        .add(-1, 'days');
      dateRange.date1 = moment(date[0]);
      break;

    case '1y':
      dateRange.date2 = moment(date[0])
        .add(1, 'year')
        .add(-1, 'days');
      dateRange.date1 = moment(date[0]);
      break;

    case '60m':
      const decimalDay = lastDays % 1;
      const hours = Math.round(decimalDay * 24);

      dateRange.date2 = date[0];
      dateRange.date1 = moment(dateRange.date2)
        .add(lastDays > -1 && lastDays < 1 ? 0 : lastDays, 'days')
        .add(hours, 'hours')
        .format(DateFormat);
      break;

    default:
      dateRange.date1 = date[0];
      dateRange.date2 = date[0];
      break;
  }

  dateRange.date1 = moment(dateRange.date1).format('YYYY-MM-DD');
  dateRange.date2 = moment(dateRange.date2).format('YYYY-MM-DD');

  return dateRange;
}

export function sortDatesList(datesList, order = 'ASC') {
  if (!datesList || !Array.isArray(datesList)) return null;

  datesList.sort(compareDates.bind(this, order));

  return datesList;
}

/**
 * Compare two dates objects in Entropy Format
 * date1, date2, cmp1, cmp2, etc.
 * according to date2 field
 */
function compareDates(order, dateA, dateB) {
  if (order === 'ASC') {
    return moment(dateA.date2).isAfter(moment(dateB.date2));
  }

  // is DESC
  return moment(dateA.date2).isBefore(moment(dateB.date2));
}

export function parserTime(timeList, groupDateTime) {
  if (timeList === 'all') return undefined;
  if (!Array.isArray(timeList)) return undefined;
  if (timeList.length === 24 || timeList.length === 0) return undefined;

  const isInvalidGranularity = !groupDateTime || (groupDateTime !== '60m' && groupDateTime !== 'rop');
  if (isInvalidGranularity) return undefined;

  const timeIntervals = reduceToTimeIntervals(timeList);

  return parseIntervalsList(timeIntervals);
}

function reduceToTimeIntervals(timeList) {
  const sortedTimeList = sortTimeList(timeList);
  const intervals = [];

  let step = 0;
  let start = sortedTimeList[0];
  let end = sortedTimeList[0];

  while (step < sortedTimeList.length) {
    step++;
    const nextHour = parseInt(getHourFromTime(sortedTimeList[step]));
    const currentHour = parseInt(getHourFromTime(end));

    // if is consecutive go next
    if (currentHour + 1 === nextHour) {
      end = sortedTimeList[step];
      continue;
    }

    // if not store current interval and go next
    intervals.push({ start, end });
    start = end = sortedTimeList[step];
  }

  return intervals;
}

function sortTimeList(timeList) {
  return timeList.sort((timeA, timeB) => {
    const hourA = parseInt(getHourFromTime(timeA));
    const hourB = parseInt(getHourFromTime(timeB));
    return hourA - hourB;
  });
}

function parseIntervalsList(intervalList) {
  return intervalList.map((interval) => {
    try {
      const time1 = getHourFromTime(interval.start);
      const time2 = getHourFromTime(interval.end);

      return {
        cmp1: '>=',
        time1,
        cmp2: '<=',
        time2,
      };
    } catch (Ex) {
      console.warn('Invalid hour format');
      return null;
    }
  });
}

function getHourFromTime(time = '00:00') {
  return moment(time, TimeFormat).format('H');
}
