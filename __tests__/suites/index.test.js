'use strict';

// Just for our self signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Import NPM modules
import request from 'request';
import fs from 'fs';

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
console.warn = () => void 0;

// Define SSL variables
const sslOptions = {
  key: './__tests__/source/ssl/key.pem',
  cert: './__tests__/source/ssl/server.crt'
};

// Define file locations
const fileLog = './server.log';
const sqlLite = './json.sqlite';

// Define request options
const requestOptions = { rejectUnauthorized: false };

// Define http options
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

// Handler: Check redirection
const checkRedirection = {
  method: 'GET',
  uri: '/checkRedirection',
  preMiddleware: [],
  postMiddleware: [],
  handler: (req, res, { sendRequest, CommandBodyObject }) => {
    // Define command body
    const testServiceCommandBody = new CommandBodyObject();
    // Assign command information
    testServiceCommandBody.destination = 'testService';
    testServiceCommandBody.funcName = 'getInfoFromSuperService';
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
              <title>Test Service Response</title>
           </head>
           <body>
              <p>${message}</p>
           </body>
        </html>
        `;
        // Build HTML
        const pageOutput = getPage(response.resultBody.resData);
        // Return
        res.send(pageOutput);
      }
    );
  }
};

// Handler: Check DB
const checkDb = {
  method: 'GET',
  uri: '/checkDb',
  handler: (req, res, { sendRequest, CommandBodyObject }) => {
    // Define command body
    const readFromDb = new CommandBodyObject();
    const writeToDb = new CommandBodyObject();
    // Assign command information
    writeToDb.destination = 'serviceCore';
    writeToDb.funcName = 'storage';
    writeToDb.body = {
      method: 'set',
      args: ['randomNumber', 1024],
      table: '_defaultDatabase'
    };
    readFromDb.destination = 'serviceCore';
    readFromDb.funcName = 'storage';
    readFromDb.body = {
      method: 'get',
      args: ['randomNumber'],
      table: '_defaultDatabase'
    };
    // Send initial request to write to database
    sendRequest(
      writeToDb,
      'serviceCore',
      true,
      void 0,
      void 0,
      (resData, origData, socket) => {
        // Send request to services
        sendRequest(
          readFromDb,
          'serviceCore',
          false,
          void 0,
          socket,
          response => {
            // Get message from service
            const messageFromDb = response.resultBody.resData.result;
            // Send back to response
            const getPage = title => `
            <html>
               <head>
                  <title>Database Verification</title>
               </head>
               <body>
                  <p>Fixed Number: ${title}</p>
               </body>
            </html>
            `;
            // Build HTML
            const pageOutput = getPage(messageFromDb);
            // Return
            res.send(pageOutput);
          }
        );
      }
    );
  }
};

// Handler: End process
const endProcess = {
  method: 'GET',
  uri: '/endProcess',
  handler: (req, res, { sendRequest, CommandBodyObject }) => {
    // Define command body
    const endProcess = new CommandBodyObject();
    // Assign command information
    endProcess.destination = 'serviceCore';
    endProcess.funcName = 'end';
    endProcess.body = {
      method: 'set',
      args: ['randomNumber', 1024],
      table: '_defaultDatabase'
    };
    // Send initial request to write to database
    sendRequest(endProcess, 'serviceCore', false, void 0, void 0, response => {
      // Get message from service
      const messageFromDb = response.resultBody.resData.message;
      // Send back to response
      const getPage = message => `
        <html>
           <head>
              <title>Shutting Down Server</title>
           </head>
           <body>
              <p>${message}</p>
           </body>
        </html>
        `;
      // Build HTML
      const pageOutput = getPage(messageFromDb);
      // Return
      res.send(pageOutput);
    });
  }
};

// Define framework options
const frameworkOptions = {
  databaseNames: ['_defaultDatabase'],
  logPath: fileLog,
  mode: 'server',
  http: [
    {
      port: 12000,
      ssl: sslOptions,
      harden: true,
      beforeStart: express => express,
      middlewares: [],
      static: ['public'],
      routes: [checkRedirection, checkDb, endProcess]
    }
  ],
  runOnStart: [],
  verbose: true
};

// Define path to the operations file
const testServerOperationsPath = './__tests__/source/services/testService';
const echoServerOperationsPath = './__tests__/source/services/echoService';

// Test suite
describe('src/index', () => {
  // Set timeout
  jest.setTimeout(30000);
  // Clear files
  beforeAll(() => {
    [fileLog].forEach(file => {
      fs.unlink(file, () => void 0);
    });
  });
  // Begin testing
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
    const MSFrameworkInstance = new MicroServiceFramework(frameworkOptions);

    // Define a micro service
    MSFrameworkInstance.defineService('testService', testServerOperationsPath, {
      runOnStart: [],
      instances: 2
    });

    // Define a micro service
    MSFrameworkInstance.defineService('echoService', echoServerOperationsPath, {
      runOnStart: [],
      instances: 1
    });

    describe('integration', () => {
      // Start server
      MSFrameworkInstance.startServer();
      // Test service to service redirection
      test('service to service redirection works', async () => {
        let requestResult = await new Promise((resolve, reject) => {
          setTimeout(
            () =>
              request(
                'https://localhost:12000/checkRedirection',
                requestOptions,
                (err, res, body) => (err === null ? resolve(body) : reject(err))
              ),
            2000
          );
        });
        expect(requestResult).toMatchSnapshot();
      });
      test('internal database service works', async () => {
        let requestResult = await new Promise((resolve, reject) => {
          setTimeout(
            () =>
              request(
                'https://localhost:12000/checkDb',
                requestOptions,
                (err, res, body) => (err === null ? resolve(body) : reject(err))
              ),
            2000
          );
        });
        expect(requestResult).toMatchSnapshot();
      });
      test('file logging works', async () => {
        let fileLogData = await new Promise((resolve, reject) => {
          setTimeout(() => {
            fs.readFile(fileLog, 'utf8', (err, contents) => {
              err === null ? resolve(contents) : reject(err);
            });
          }, 3000);
        });
        expect(fileLogData).toBeDefined();
      });
      test('sql lite file works', async () => {
        let sqLiteData = await new Promise((resolve, reject) => {
          setTimeout(() => {
            fs.readFile(sqlLite, 'utf8', (err, contents) => {
              err === null ? resolve(contents) : reject(err);
            });
          }, 3000);
        });
        expect(sqLiteData).toBeDefined();
      });

      afterAll(() => {
        request(
          'https://localhost:12000/endProcess',
          requestOptions,
          () => void 0
        );
      });
    });
  });
});
