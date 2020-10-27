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
} from '../tmp/lib/validate';

// Test suite
describe('tmp/lib/validate', () => {
  describe('validateRouteOptions()', () => {
    const getOptions = (omitList, overwriteProps) =>
      omit(
        {
          method: 'GET',
          uri: '/service',
          preMiddleware: [],
          postMiddleware: [],
          handler: () => void 0,
          ...overwriteProps
        },
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
        new Error('The http route option "preMiddleware" must be an array!')
      );
    });
    test('throw new error: postMiddleware is not an array', () => {
      expect(() => {
        validateRouteOptions(getOptions([], { postMiddleware: {} }));
      }).toThrow(
        new Error('The http route option "postMiddleware" must be an array!')
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
      ].map((http) => omit({ ...http, ...overwriteProps }, omitList));
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
      omit({ runScript: () => void 0, ...overwriteProps }, omitList);
    test('throw new error: coreOperation is not a function', () => {
      expect(validateCoreOperations(getOptions([], { runScript: [] }))).toEqual(
        false
      );
    });
    test('validation passed with correct options', () => {
      expect(validateCoreOperations(getOptions([], {}))).toEqual(true);
    });
  });
  describe('validateOptions()', () => {
    const getOptions = (omitList, overwriteProps) =>
      omit(
        {
          onConClose: () => void 0,
          onConRequest: () => void 0,
          coreOperations: { runScript: () => void 0 },
          databaseNames: ['_defaultDatabase'],
          logPath: './server.log',
          mode: 'server',
          http: [
            {
              port: 12000,
              ssl: false,
              harden: true,
              beforeStart: () => void 0,
              middlewares: [],
              static: [],
              routes: []
            }
          ],
          runOnStart: [],
          verbose: true,
          ...overwriteProps
        },
        omitList
      );
    test('throw new error: mode is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { mode: 'modeNotValid' }));
      }).toThrow(
        new Error(
          'The "mode" option is not valid, it can only be "server" or "client"'
        )
      );
    });
    test('throw new error: http is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { http: ['modeNotValid'] }));
      }).toThrow(new Error('The http option "port" must be a number!'));
    });
    test('throw new error: databaseNames is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { databaseNames: 'modeNotValid' }));
      }).toThrow(
        new Error(
          'The "databaseNames" option is not valid, it must be an array of strings'
        )
      );
    });
    test('throw new error: verbose is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { verbose: 'modeNotValid' }));
      }).toThrow(
        new Error('The "verbose" option is not valid, it must be an boolean')
      );
    });
    test('throw new error: maxBuffer is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { maxBuffer: 'modeNotValid' }));
      }).toThrow(
        new Error('The "maxBuffer" option is not valid, it must be a number')
      );
    });
    test('throw new error: logPath is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { logPath: 9999 }));
      }).toThrow(
        new Error('The "logPath" option is not valid, it must be a string')
      );
    });
    test('throw new error: restartTimeout is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { restartTimeout: 'modeNotValid' }));
      }).toThrow(
        new Error(
          'The "restartTimeout" option is not valid, it must be a number'
        )
      );
    });
    test('throw new error: connectionTimeout is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { connectionTimeout: 'modeNotValid' }));
      }).toThrow(
        new Error(
          'The "connectionTimeout" option is not valid, it must be a number'
        )
      );
    });
    test('throw new error: msConnectionTimeout is incorrect', () => {
      expect(() => {
        validateOptions(
          getOptions([], { msConnectionTimeout: 'modeNotValid' })
        );
      }).toThrow(
        new Error(
          'The "msConnectionTimeout" option is not valid, it must be a number'
        )
      );
    });
    test('throw new error: msConnectionRetryLimit is incorrect', () => {
      expect(() => {
        validateOptions(
          getOptions([], { msConnectionRetryLimit: 'modeNotValid' })
        );
      }).toThrow(
        new Error(
          'The "msConnectionRetryLimit" option is not valid, it must be a number'
        )
      );
    });
    test('throw new error: apiGatewayPort is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { apiGatewayPort: 'modeNotValid' }));
      }).toThrow(
        new Error(
          'The "apiGatewayPort" option is not valid, it must be a number'
        )
      );
    });
    test('throw new error: portRangeStart is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { portRangeStart: 'modeNotValid' }));
      }).toThrow(
        new Error(
          'The "portRangeStart" option is not valid, it must be a number'
        )
      );
    });
    test('throw new error: portRangeFinish is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { portRangeFinish: 'modeNotValid' }));
      }).toThrow(
        new Error(
          'The "portRangeFinish" option is not valid, it must be a number'
        )
      );
    });
    test('throw new error: runOnStart is incorrect', () => {
      expect(() => {
        validateOptions(getOptions([], { runOnStart: [99] }));
      }).toThrow(
        new Error(
          'The "runOnStart" option is not valid, it must be a array of strings corresponding to defined operations'
        )
      );
    });
    test('throw new error: coreOperations is incorrect', () => {
      expect(() => {
        validateOptions(
          getOptions([], { coreOperations: 888, runOnStart: [] })
        );
      }).toThrow(
        new Error(
          'The "coreOperations" option is not valid, it must be an object composed of strings ("operations") which map to functions'
        )
      );
    });
  });
  describe('validateServiceOptions()', () => {
    const getOptions = (omitList, overwriteProps) =>
      omit(
        {
          runOnStart: [],
          loadBalancing: 'random',
          instances: 5,
          ...overwriteProps
        },
        omitList
      );

    test('throw new error: runOnStart is incorrect', () => {
      expect(() => {
        validateServiceOptions(getOptions([], { runOnStart: [99] }));
      }).toThrow(
        new Error(
          'The service options "runOnStart" option is not valid, it must be a valid array'
        )
      );
    });
    test('throw new error: loadBalancing is incorrect', () => {
      expect(() => {
        validateServiceOptions(
          getOptions([], { loadBalancing: 'fakeLoadBalancing' })
        );
      }).toThrow(
        new Error(
          'The service options "loadBalancing" option is not valid, can either be "random" or "roundRobin" or a function(socketList)'
        )
      );
    });
    test('throw new error: instances is incorrect', () => {
      expect(() => {
        validateServiceOptions(getOptions([], { instances: 'FAKE' }));
      }).toThrow(
        new Error(
          'The service options "instances" option is not valid, it must be an number above 1'
        )
      );
    });
  });
});
