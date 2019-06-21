import moment from 'moment';

import { DEFAULT_DATE_FORMAT, parseDates } from '../Date';

const { expect } = require('chai');

const toJSON = (x) => JSON.stringify(x);

describe('DATE HELPER TESTS', () => {
  describe('Parser Date Generals', () => {
    it('Should return exception', (done) => {
      try {
        parseDates([], {
          mode: '_none_allowed',
        });

        done(new Error('No mode exception throwed'));
      } catch (Ex) {
        done();
      }
    });

    it('Should succes on single mode ', (done) => {
      parseDates(['1991-05-28'], {
        mode: 'single',
      });
      done();
    });

    it('Should succes on range mode', (done) => {
      parseDates(['1991-05-28'], {
        mode: 'range',
      });
      done();
    });

    it('Should succes on multiple mode', (done) => {
      parseDates(['1991-05-28'], {
        mode: 'multiple',
      });
      done();
    });
  });

  describe('Parser Single Dates', () => {
    it('Should parser single date', () => {
      const dates = [moment().format(DEFAULT_DATE_FORMAT)];

      const output = parseDates(dates, {
        mode: 'single',
      });

      const expectedOutput = [
        {
          cmp1: '>=',
          date1: dates[0],
          cmp2: '<=',
          date2: dates[0],
        },
      ];

      expect(toJSON(output)).to.equal(toJSON(expectedOutput));
    });

    it('Should parser single dates array in other format', () => {
      const DATE_FORMAT = 'YYYY-MM';
      const dates = [moment().format(DATE_FORMAT), moment().format(DATE_FORMAT)];

      const output = parseDates(dates, {
        mode: 'single',
        granularity: '24h',
        dateFormat: DATE_FORMAT,
      });

      const expectedOutput = [
        {
          cmp1: '>=',
          date1: dates[0],
          cmp2: '<=',
          date2: dates[0],
        },
        {
          cmp1: '>=',
          date1: dates[0],
          cmp2: '<=',
          date2: dates[0],
        },
      ];

      expect(toJSON(output)).to.equal(toJSON(expectedOutput));
    });

    it('Should parser and substract days', () => {
      const dates = [moment().format(DEFAULT_DATE_FORMAT)];

      const output = parseDates(dates, {
        mode: 'single',
        granularity: '24h',
        periodToSubstract: { days: -1 },
      });

      const expectedOutput = [
        {
          cmp1: '>=',
          date1: moment(dates[0])
            .add(-1, 'days')
            .format(DEFAULT_DATE_FORMAT),
          cmp2: '<=',
          date2: dates[0],
        },
      ];

      expect(toJSON(output)).to.equal(toJSON(expectedOutput));
    });

    it('Should parser and substract weeks', () => {
      const dates = [moment().format(DEFAULT_DATE_FORMAT)];

      const output = parseDates(dates, {
        mode: 'single',
        granularity: '7d',
        periodToSubstract: { weeks: 0 },
      });

      const endOfWeek = moment(dates[0])
        .endOf('isoWeek')
        .format(DEFAULT_DATE_FORMAT);

      const expectedOutput = [
        {
          cmp1: '>=',
          date1: moment(endOfWeek)
            .startOf('isoWeeks')
            .format(DEFAULT_DATE_FORMAT),
          cmp2: '<=',
          date2: endOfWeek,
        },
      ];

      expect(toJSON(output)).to.equal(toJSON(expectedOutput));
    });

    it('Should parser and substract months', () => {
      const dates = [moment().format(DEFAULT_DATE_FORMAT)];

      const output = parseDates(dates, {
        mode: 'single',
        granularity: '30d',
        periodToSubstract: { months: -1 },
      });

      const endOfMonth = moment(dates[0])
        .endOf('month')
        .format(DEFAULT_DATE_FORMAT);

      const expectedOutput = [
        {
          cmp1: '>=',
          date1: moment(endOfMonth)
            .add(-2, 'months')
            .endOf('month')
            .add(1, 'days')
            .format(DEFAULT_DATE_FORMAT),
          cmp2: '<=',
          date2: endOfMonth,
        },
      ];

      expect(toJSON(output)).to.equal(toJSON(expectedOutput));
    });
  });

  describe('Parser range Dates', () => {
    it('Should parser range dates', () => {
      const dates = [
        moment().format(DEFAULT_DATE_FORMAT),
        moment()
          .add('days', 1)
          .format(DEFAULT_DATE_FORMAT),
      ];

      const output = parseDates(dates, {
        mode: 'range',
      });

      const expectedOutput = [
        {
          cmp1: '>=',
          date1: dates[0],
          cmp2: '<=',
          date2: dates[1],
        },
      ];

      expect(toJSON(output)).to.equal(toJSON(expectedOutput));
    });
  });
});
