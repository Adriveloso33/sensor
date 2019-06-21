import Factory from '../Factory';

describe('FACTORY CLASS TESTS', () => {
  describe('BUILD METHOD', () => {
    it('Should Throws an Exception', (done) => {
      try {
        Factory.build({});

        done(new Error('No not implemented exception throwed'));
      } catch (Ex) {
        done();
      }
    });
  });
});
