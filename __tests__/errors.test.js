'use strict';

import { Risen } from '../tmp';

describe('handling transport errors', () => {
  describe('test redirect failed on micro service function which doesnt exist', () => {
    let output;

    beforeEach((done) =>
      new Risen({
        mode: 'client',
        verbose: false
      }).request(
        {
          body: { arguments: [1, 2, 3, 4, 5] },
          destination: 'devService',
          functionName: 'nonExistantService'
        },
        (data) => {
          output = data;
          done();
        }
      )
    );

    test('http status code is 501', () => {
      expect(output.command.code).toEqual(501);
    });

    test('service request status code is false', () => {
      expect(output.status).toEqual(false);
    });

    test('response data is expected', () => {
      expect(output.response).toEqual(null);
    });

    test('error data is expected', () => {
      expect(output.error).toEqual({
        action: 'Internal micro service redirection failed',
        entity: 'Micro service: devService',
        originalData: { arguments: [1, 2, 3, 4, 5] }
      });
    });
  });

  describe('test redirect failed on service core for a core function', () => {
    let output;

    beforeEach((done) =>
      new Risen({
        mode: 'client',
        verbose: false
      }).request(
        {
          body: { arguments: [1, 2, 3, 4, 5] },
          destination: 'serviceCore',
          functionName: 'nonExistantService'
        },
        (data) => {
          output = data;
          done();
        }
      )
    );

    test('http status code is 503', () => {
      expect(output.command.code).toEqual(503);
    });

    test('service request status code is false', () => {
      expect(output.status).toEqual(false);
    });

    test('response data is expected', () => {
      expect(output.response).toEqual(null);
    });

    test('error data is expected', () => {
      expect(output.error).toEqual({
        entity: 'Service core',
        action: 'Service redirection',
        originalData: {
          data: {
            destination: 'serviceCore',
            functionName: 'nonExistantService',
            body: { arguments: [1, 2, 3, 4, 5] }
          },
          destination: 'serviceCore',
          keepAlive: false
        }
      });
    });
  });

  describe('test redirect failed on a service which doesnt exist', () => {
    let output;

    beforeEach((done) =>
      new Risen({
        mode: 'client',
        verbose: false
      }).request(
        {
          body: { arguments: [1, 2, 3, 4, 5] },
          destination: 'nonExistantService',
          functionName: 'randomFunction'
        },
        (data) => {
          output = data;
          done();
        }
      )
    );

    test('http status code is 500', () => {
      expect(output.command.code).toEqual(500);
    });

    test('service request status code is false', () => {
      expect(output.status).toEqual(false);
    });

    test('response data is expected', () => {
      expect(output.response).toEqual(null);
    });

    test('error data is expected', () => {
      expect(output.error).toEqual({
        entity: 'Service core',
        action: 'Service redirection',
        originalData: {
          data: {
            destination: 'nonExistantService',
            functionName: 'randomFunction',
            body: { arguments: [1, 2, 3, 4, 5] }
          },
          destination: 'nonExistantService',
          keepAlive: false
        }
      });
    });
  });
});
