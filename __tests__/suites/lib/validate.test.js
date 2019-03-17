'use strict';

// Load NPM modules
import { omit } from 'lodash';

// Import consts and functions
import {
  validateRouteOptions,
  validateHttpOptions,
  validateCoreOperations,
  validateOptions,
  validateServiceOptions
} from './../../../dist/lib/validate';

// Test suite
describe('src/lib/validate', () => {
  describe('validateRouteOptions()', () => {
    const getOptions = (omitList, overwriteProps) =>
      omit(
        Object.assign(
          {},
          {
            method: 'GET',
            uri: '/service',
            preMiddleware: [],
            postMiddleware: [],
            handler: () => void 0
          },
          overwriteProps
        ),
        omitList
      );
    test('throw new error: handler is incorrect', () => {
      expect(() => {
        validateRouteOptions(getOptions([], { handler: 'FAKE METHOD' }));
      }).toThrow(
        new Error('The http route option "handler" must be a function!')
      );
    });
    test('throw new error: handler does not exist', () => {
      expect(() => {
        validateRouteOptions(getOptions(['handler'], {}));
      }).toThrow(
        new Error('The http route option "handler" must be a function!')
      );
    });
    test('throw new error: method is incorrect', () => {
      expect(() => {
        validateRouteOptions(getOptions([], { method: 'FAKE METHOD' }));
      }).toThrow(new Error('The http route option "method" is invalid!'));
    });
    test('throw new error: method does not exist', () => {
      expect(() => {
        validateRouteOptions(getOptions(['method'], {}));
      }).toThrow(new Error('The http route option "method" is invalid!'));
    });
    test('throw new error: uri is incorrect', () => {
      expect(() => {
        validateRouteOptions(getOptions([], { uri: 9999 }));
      }).toThrow(new Error('The http route option "uri" must be a string!'));
    });
    test('throw new error: uri does not exist', () => {
      expect(() => {
        validateRouteOptions(getOptions(['uri'], {}));
      }).toThrow(new Error('The http route option "uri" must be a string!'));
    });
    test('throw new error: preMiddleware is not an array', () => {
      expect(() => {
        validateRouteOptions(getOptions([], { preMiddleware: {} }));
      }).toThrow(
        new Error(
          'The http route option "preMiddleware" must be an array if its defined!'
        )
      );
    });
    test('throw new error: postMiddleware is not an array', () => {
      expect(() => {
        validateRouteOptions(getOptions([], { postMiddleware: {} }));
      }).toThrow(
        new Error(
          'The http route option "postMiddleware" must be an array if its defined!'
        )
      );
    });
    test('validation passed with correct options', () => {
      expect(() => {
        validateRouteOptions(getOptions([], {}));
      }).not.toThrow();
    });
  });
  describe('validateHttpOptions()', () => {
    const getOptions = (omitList, overwriteProps) =>
      [
        {
          port: 12000,
          ssl: { key: './ssl/key.pem', cert: './ssl/server.crt' },
          harden: true,
          beforeStart: () => void 0,
          middlewares: [],
          static: ['public'],
          routes: []
        }
      ].map(http => omit(Object.assign({}, http, overwriteProps), omitList));
    test('throw new error: port is not a number', () => {
      expect(() => {
        validateHttpOptions(getOptions([], { port: '10000' }));
      }).toThrow(new Error('The http option "port" must be a number!'));
    });
    test('throw new error: port is not defined', () => {
      expect(() => {
        validateHttpOptions(getOptions(['port'], {}));
      }).toThrow(new Error('The http option "port" must be a number!'));
    });
    test('throw new error: ssl is not an object/boolean', () => {
      expect(() => {
        validateHttpOptions(getOptions([], { ssl: '10000' }));
      }).toThrow(
        new Error(
          'The http option "ssl" must be a boolean false or an object with the keys: {key, ca, cert}'
        )
      );
    });
    test('throw new error: harden is not a boolean', () => {
      expect(() => {
        validateHttpOptions(getOptions([], { harden: '10000' }));
      }).toThrow(new Error('The http option "harden" must be a boolean!'));
    });
    test('throw new error: beforeStart is not a function', () => {
      expect(() => {
        validateHttpOptions(getOptions([], { beforeStart: '10000' }));
      }).toThrow(
        new Error('The http option "beforeStart" must be a function!')
      );
    });
    test('throw new error: middlewares is not an array', () => {
      expect(() => {
        validateHttpOptions(getOptions([], { middlewares: '10000' }));
      }).toThrow(new Error('The http option "middlewares" must be an array!'));
    });
    test('throw new error: static is not an array', () => {
      expect(() => {
        validateHttpOptions(getOptions([], { static: '10000' }));
      }).toThrow(new Error('The http option "static" must be an array!'));
    });
    test('throw new error: routes is not an array', () => {
      expect(() => {
        validateHttpOptions(getOptions([], { routes: '10000' }));
      }).toThrow(
        new Error(
          'The http option "routes" must be an array with valid configuration!'
        )
      );
    });
    test('validation passed with correct options', () => {
      expect(() => {
        validateHttpOptions(getOptions([], {}));
      }).not.toThrow();
    });
  });
  describe('validateCoreOperations()', () => {
    const getOptions = (omitList, overwriteProps) =>
      omit(
        Object.assign({}, { runScript: () => void 0 }, overwriteProps),
        omitList
      );
    test('throw new error: coreOperation is not a function', () => {
      expect(validateCoreOperations(getOptions([], { runScript: [] }))).toEqual(
        false
      );
    });
    test('validation passed with correct options', () => {
      expect(validateCoreOperations(getOptions([], {}))).toEqual(true);
    });
  });
});
