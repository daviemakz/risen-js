'use strict';

import { uniqueArray, getRandomElements } from '../tmp/lib/core';
import { makeRequest, host, httpPortOne } from './utils/helpers';

// Test suite
describe('tmp/lib/core', () => {
  describe('uniqueArray()', () => {
    test('to match snapshot', () => {
      expect(uniqueArray([1, 1, 1, 2, 3, 4, 5])).toMatchSnapshot();
    });
  });

  describe('getRandomElements()', () => {
    test('to match snapshot', () => {
      expect(
        Array.isArray(getRandomElements([1, 1, 1, 2, 3, 4, 5], 2))
      ).toMatchSnapshot();
    });
  });

  describe('run on start & core operations', () => {
    describe('can execute a custom core operation on service core', () => {
      let output;

      beforeAll((done) => {
        return makeRequest({
          host,
          method: 'get',
          port: httpPortOne,
          path: '/reflect-core-operation',
          callback: (data) => {
            output = data;
            done();
          }
        });
      });

      test('http status code is 200', () => {
        expect(output.status).toEqual(200);
      });

      test('service request status code is true', () => {
        expect(output.data.status).toEqual(true);
      });

      test('response data is expected', () => {
        expect(output.data.response).toEqual('Reflect service core!');
      });
    });

    describe('can execute a custom core operation on micro service', () => {
      let output;

      beforeAll((done) => {
        return makeRequest({
          host,
          method: 'get',
          port: httpPortOne,
          path: '/get-local-storage',
          callback: (data) => {
            output = data;
            done();
          }
        });
      });

      test('http status code is 200', () => {
        expect(output.status).toEqual(200);
      });

      test('service request status code is true', () => {
        expect(output.data.status).toEqual(true);
      });

      test('response data is expected', () => {
        expect(output.data.response).toEqual({ key: 'management' });
      });
    });

    describe('runOnStart function saves the number which can be read by this function', () => {
      let output;

      beforeAll((done) => {
        return makeRequest({
          host,
          method: 'get',
          port: httpPortOne,
          path: '/get-saved-number',
          callback: (data) => {
            output = data;
            done();
          }
        });
      });

      test('http status code is 200', () => {
        expect(output.status).toEqual(200);
      });

      test('service request status code is true', () => {
        expect(output.data.status).toEqual(true);
      });

      test('response data is expected', () => {
        expect(output.data.response).toEqual({
          isSuccess: true,
          message: 'The operation completed successfully!',
          result: 500
        });
      });
    });
  });

  describe('storage()', () => {
    describe('can set data via a "storageService" and retrieve it via "serviceCore"', () => {
      let output;

      beforeAll((done) => {
        const number = 81;
        makeRequest({
          host,
          method: 'post',
          body: { number },
          port: httpPortOne,
          path: '/save-powered-number',
          callback: (data) => {
            output = data;
            done();
          }
        });
      });

      [
        true,
        {
          isSuccess: true,
          result: 6561,
          message: 'The operation completed successfully!'
        }
      ].forEach((response, index) => {
        test('http status code is 200', () => {
          expect(output.data[index].command.code).toEqual(200);
        });

        test('service request status code is true', () => {
          expect(output.data[index].status).toEqual(true);
        });

        test('response data is expected', () => {
          expect(output.data[index].response).toEqual(response);
        });
      });
    });
  });

  describe('changeInstances()', () => {
    describe('can increase the number of the "instanceService" and get responses from all processes', () => {
      let output;

      beforeAll((done) => {
        const addInstances = 2;
        makeRequest({
          host,
          method: 'post',
          body: { addInstances },
          port: httpPortOne,
          path: '/change-instances',
          callback: (data) => {
            output = data;
            done();
          }
        });
      });

      describe('check that all responses succeeded', () => {
        Array.from(Array(6)).forEach((_, index) => {
          test(`http status code is 200 for process ${index + 1}`, () => {
            expect(output.data[index].command.code).toEqual(200);
          });

          test(`service request status code is true for process ${
            index + 1
          }`, () => {
            expect(output.data[index].status).toEqual(true);
          });
        });
      });

      describe('there are only three instances', () => {
        test('instance count is expected', async () => {
          return new Promise((resolve) => {
            const checkOutput = () => {
              if (output) {
                resolve();
              } else {
                setTimeout(() => {
                  checkOutput();
                }, 10);
              }
            };
            checkOutput();
          }).then(() => {
            const uniqueInstances = [
              ...new Set(
                output.data
                  .map((proc) => proc.transport.responseSource.instanceId)
                  .filter((instId) => instId)
              )
            ];
            expect(uniqueInstances.length).toEqual(3);
          });
        });
      });
    });
  });
});
