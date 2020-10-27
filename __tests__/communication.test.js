'use strict';

import { Risen } from '../tmp';
import { makeRequest, host, httpPortOne, httpPortTwo } from './utils/helpers';

describe('communication', () => {
  describe('https', () => {
    describe('response from the "echoService" from a client HTTPS request | express server 1 | callback', () => {
      let output;

      beforeAll((done) => {
        return makeRequest({
          host,
          method: 'get',
          port: httpPortOne,
          path: '/echo-data-callback',
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
        expect(output.data.response).toEqual('Testing the echo data service.');
      });

      describe('pre middleware', () => {
        test('append a header via the middleware', () => {
          expect(output.headers['x-middleware']).toEqual(
            'F39B2FCE-6ACE-46EA-A558-00DD3FFA5427'
          );
        });

        test('append a header via the pre middleware', () => {
          expect(output.headers['x-pre-middleware']).toEqual(
            '9269F051-5BB2-4EF1-A8BE-66EEF83BC443'
          );
        });

        test('send the data back from the post middleware', () => {
          expect(true).toEqual(true);
        });
      });

      describe('post middleware', () => {
        let output;

        beforeAll((done) => {
          return makeRequest({
            host,
            method: 'get',
            port: httpPortOne,
            path: '/echo-data-middleware-callback',
            callback: (data) => {
              output = data;
              done();
            }
          });
        });

        describe('send the data back from the post middleware not the handler', () => {
          test('http status code is 200', () => {
            expect(output.status).toEqual(200);
          });

          test('service request status code is true', () => {
            expect(output.data.status).toEqual(true);
          });

          test('response data is expected', () => {
            expect(output.data.response).toEqual(
              'Retrieving data from post middleware.'
            );
          });

          test('header is set in the post middleware and returned', () => {
            expect(output.headers['x-post-middleware']).toEqual(
              'E8C12E65-3C59-4B05-9C79-7F07EE7BE81B'
            );
          });
        });
      });
    });

    describe('response from the "echoService" from a client HTTPS request | express server 1 | promise', () => {
      let output;

      beforeAll((done) => {
        return makeRequest({
          host,
          method: 'get',
          port: httpPortOne,
          path: '/echo-data-promise',
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
        expect(output.data.response).toEqual(
          'Testing the echo data service via a promise.'
        );
      });
    });
  });

  describe('http', () => {
    describe('response from the "echoService" from a client HTTP request | express server 2 | promise', () => {
      let output;

      beforeAll((done) => {
        return makeRequest({
          host,
          ssl: false,
          method: 'get',
          port: httpPortTwo,
          path: '/echo-data-promise',
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
        expect(output.data.response).toEqual(
          'Testing the echo data service via a promise.'
        );
      });
    });

    describe('response from the "echoService" from a client HTTP request | express server 2 | callback', () => {
      let output;

      beforeAll((done) => {
        return makeRequest({
          host,
          ssl: false,
          method: 'get',
          port: httpPortTwo,
          path: '/echo-data-callback',
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
        expect(output.data.response).toEqual('Testing the echo data service.');
      });
    });
  });

  describe('via client mode', () => {
    describe('via request() function', () => {
      let output;

      beforeEach((done) =>
        new Risen({
          mode: 'client',
          verbose: false
        }).request(
          {
            body: 'Testing the echo data service.',
            destination: 'devService',
            functionName: 'echoData'
          },
          (data) => {
            output = data;
            done();
          }
        )
      );

      test('http status code is 200', () => {
        expect(output.command.code).toEqual(200);
      });

      test('service request status code is true', () => {
        expect(output.status).toEqual(true);
      });

      test('response data is expected', () => {
        expect(output.response).toEqual('Testing the echo data service.');
      });
    });

    describe('via requestChain() function', () => {
      let output;

      beforeEach((done) =>
        new Risen({
          mode: 'client',
          verbose: false
        }).requestChain(
          [
            {
              body: 'Request Two',
              destination: 'devService',
              functionName: 'getNumberFifty'
            },
            {
              body: 'Request Three',
              destination: 'devService',
              functionName: 'getNumberOneHundred'
            },
            {
              generateCommand: (body, results) => {
                return {
                  body: {
                    numberList: results.map((res) => res.response),
                    calculationMethod: 'addArrayElements'
                  },
                  destination: 'devService',
                  functionName: 'performCalculation'
                };
              }
            },
            {
              body: 125,
              generateBody: (body, results) => {
                const numberList = results
                  .map((res) => res.response)
                  .concat(body);
                return {
                  numberList,
                  calculationMethod: 'multiplyArrayElements'
                };
              },
              destination: 'devService',
              functionName: 'performCalculation'
            },
            {
              body: {
                numberList: [133, 43, 34, 2],
                calculationMethod: 'divideArrayElements'
              },
              destination: 'devService',
              functionName: 'performCalculation'
            },
            {
              body: {
                numberList: [21, 34, 51, 31],
                calculationMethod: 'subtractArrayElements'
              },
              destination: 'devService',
              functionName: 'performCalculation'
            }
          ],
          (data) => {
            output = data;
            done();
          }
        )
      );

      [50, 100, 150, 93750000, 0.045485636114911084, -95].forEach(
        (response, index) => {
          test('http status code is 200', () => {
            expect(output[index].command.code).toEqual(200);
          });

          test('service request status code is true', () => {
            expect(output[index].status).toEqual(true);
          });

          test('response data is expected', () => {
            expect(output[index].response).toEqual(response);
          });
        }
      );
    });
  });

  describe('can communicate with a service (devService) from another service (numbersService)', () => {
    describe('multiply array of elements via numbersService', () => {
      let output;

      beforeAll((done) => {
        makeRequest({
          host,
          method: 'post',
          body: {
            numberList: [13, 44, 55, 32, 55],
            calculationMethod: 'multiplyArrayElements'
          },
          port: httpPortOne,
          path: '/calculate-numbers',
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
        expect(output.data.response).toEqual(55369600);
      });
    });

    describe('divide array of elements via numbersService', () => {
      let output;

      beforeAll((done) => {
        makeRequest({
          host,
          method: 'post',
          body: {
            numberList: [22, 34, 52],
            calculationMethod: 'divideArrayElements'
          },
          port: httpPortOne,
          path: '/calculate-numbers',
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
        expect(output.data.response).toEqual(0.01244343891402715);
      });
    });

    describe('add array of elements via numbersService', () => {
      let output;

      beforeAll((done) => {
        makeRequest({
          host,
          method: 'post',
          body: {
            numberList: [122, 33, 44, 22, 52],
            calculationMethod: 'addArrayElements'
          },
          port: httpPortOne,
          path: '/calculate-numbers',
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
        expect(output.data.response).toEqual(273);
      });
    });

    describe('subtract array of elements via numbersService', () => {
      let output;

      beforeAll((done) => {
        makeRequest({
          host,
          method: 'post',
          body: {
            numberList: [122, 33, 44, 22, 52],
            calculationMethod: 'subtractArrayElements'
          },
          port: httpPortOne,
          path: '/calculate-numbers',
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
        expect(output.data.response).toEqual(-29);
      });
    });
  });
});
