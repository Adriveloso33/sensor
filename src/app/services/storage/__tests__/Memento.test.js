import { expect } from 'chai';

import Memento from '../Memento';

describe('MEMENTO TESTS', () => {
  describe('SIMPLE STORAGE', () => {
    it('Should Pass', () => {
      const storage = new Memento();

      storage.setState('data1', 2000);

      expect(storage.getState('data1')).to.equal(2000);
    });

    it('Should Return Initial State', () => {
      const storage = new Memento({ state1: 9999 });

      expect(storage.getState('state1')).to.equal(9999);
    });

    it('Should Pass with Null Initial State', () => {
      const storage = new Memento(null);

      storage.setState('data1', 123);
      expect(storage.getState('data1')).to.equal(123);
    });
  });
});
