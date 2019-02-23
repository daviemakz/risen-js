'use strict';

// Import NPM modules
import request from 'request';

// Import consts and functions
import {
  defaultServiceOptions,
  buildSecureOptions,
  buildHttpOptions,
  defaultInstanceOptions,
  CommandBodyObject,
  ResponseBodyObject,
  MicroServiceFramework
} from './../../dist';

// Hide console
// console.log = () => void 0;
// console.warn = () => void 0;

// Define variables
const sslOptions = {
  key: './__tests__/source/ssl/key.pem',
  cert: './__tests__/source/ssl/server.crt'
};

const httpOptions = {
  port: 12000,
  ssl: sslOptions,
  harden: true,
  middlewares: [],
  static: ['public'],
  routes: [
    {
      method: 'GET',
      uri: '/service',
      preMiddleware: [],
      postMiddleware: [],
      handler: (...args) => {
        return args;
      }
    },
    {
      method: 'GET',
      uri: '/'
    }
  ]
};

// Test suite
describe('src/index', () => {
  describe('const defaultInstanceOptions', () => {
    test('snapshot is expected', () => {
      expect(defaultInstanceOptions).toMatchSnapshot();
    });
  });
  describe('const defaultServiceOptions', () => {
    test('snapshot is expected', () => {
      expect(defaultServiceOptions).toMatchSnapshot();
    });
  });
  describe('buildSecureOptions()', () => {
    test('snapshot is expected', () => {
      expect(buildSecureOptions(sslOptions)).toMatchSnapshot();
    });
  });
  describe('buildHttpOptions()', () => {
    test('snapshot is expected', () => {
      expect(buildHttpOptions(httpOptions)).toMatchSnapshot();
    });
  });
  describe('ResponseBodyObject()', () => {
    test('snapshot is expected', () => {
      expect(ResponseBodyObject()).toMatchSnapshot();
    });
  });
  describe('CommandBodyObject()', () => {
    test('snapshot is expected', () => {
      expect(CommandBodyObject()).toMatchSnapshot();
    });
  });
  describe('class MicroServiceFramework()', () => {
    // Initialise instance
    const MSFrameworkInstance = new MicroServiceFramework({
      databaseNames: ['_defaultDatabase'],
      logPath: './server.log',
      mode: 'server',
      http: [
        {
          port: 12000,
          ssl: sslOptions,
          harden: true,
          beforeStart: express => express,
          middlewares: [],
          static: ['public'],
          routes: [
            {
              method: 'GET',
              uri: '/service',
              preMiddleware: [],
              postMiddleware: [],
              handler: (req, res, { sendRequest, CommandBodyObject }) => {
                // Define command body
                const testServiceCommandBody = new CommandBodyObject();
                // Assign command information
                testServiceCommandBody.destination = 'testService';
                testServiceCommandBody.funcName = 'testInfo';
                testServiceCommandBody.body = null;
                // Send initial request to micro service
                sendRequest(
                  testServiceCommandBody,
                  'testService',
                  false,
                  void 0,
                  void 0,
                  response => {
                    // Send back to response
                    const getPage = message => `
                    <html>
                       <head>
                          <title>Super Service Response</title>
                       </head>
                       <body>
                          <p>${message}</p>
                       </body>
                    </html>
                    `;
                    // Build HTML
                    const pageOutput = getPage(response);
                    // Return
                    res.send(pageOutput);
                  }
                );
              }
            }
          ]
        }
      ],
      runOnStart: [],
      verbose: true
    });

    // Define path to the operations file
    const testServerOperationsPath = './__tests__/source/services/testService';

    // Define a micro service
    MSFrameworkInstance.defineService('testService', testServerOperationsPath, {
      runOnStart: [],
      instances: 5
    });

    test('initialisation snapshot is expected', () => {
      expect(MSFrameworkInstance).toMatchSnapshot();
    });

    test('integration: micro service works', async () => {
      MSFrameworkInstance.startServer();
      let resultFromService = await new Promise(resolve => {
        setTimeout(
          () =>
            request('https://localhost:12000', {}, (err, res, body) =>
              resolve(body)
            ),
          5000
        );
      });
      expect(resultFromService).toMatchSnapshot();
    });
  });
});
