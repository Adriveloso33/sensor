import React from 'react';
import Factory from '../Factory';

class FakeFactoryService extends Factory {}

const DummyReactComponent = ({ name }) => <div>{`Hello ${name}`}</div>;

class TestFactoryService extends Factory {
  static build(data) {
    switch (data.type) {
      case 'dummy':
        return <DummyReactComponent {...data.props} />;
      default:
        throw new Error('Wrong type or not allowed');
    }
  }
}

describe('FACTORY CLASS AS INTERFACE', () => {
  describe('BUILD METHOD', () => {
    it('Should Throws an Exception', (done) => {
      try {
        FakeFactoryService.build({});

        done(new Error('No not implemented exception throwed'));
      } catch (Ex) {
        done();
      }
    });
  });

  describe('RETURNING REACT COMPONENTS', () => {
    it('Should Throws an Exception', (done) => {
      try {
        const data = {
          type: 'dummy',
          props: {
            name: 'WDNA',
          },
        };

        TestFactoryService.build(data);

        done();
      } catch (Ex) {
        done(new Error('Exception throwed'));
      }
    });
  });
});
