'use strict';

import { makeRequest, host, httpPortOne, httpPortTwo } from './utils/helpers';

describe('static paths', () => {
  describe('http', () => {
    let output;

    beforeAll((done) => {
      return makeRequest({
        host,
        ssl: false,
        method: 'get',
        port: httpPortTwo,
        path: '/example.json',
        callback: (data) => {
          output = data;
          done();
        }
      });
    });
    test('can get public path from http server', () => {
      expect(output.data).toEqual({ age: 21, name: 'Rodger Freeman' });
    });
  });

  describe('https', () => {
    let output;

    beforeAll((done) => {
      return makeRequest({
        host,
        ssl: true,
        method: 'get',
        port: httpPortOne,
        path: '/example.json',
        callback: (data) => {
          output = data;
          done();
        }
      });
    });
    test('can get public path from http server', () => {
      expect(output.data).toEqual({
        age: 56,
        name: 'Mormon Robert'
      });
    });
  });
});
