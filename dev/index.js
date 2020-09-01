'use strict';

/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

// Import risen framework
import path from 'path';
import execa from 'execa';
import { Risen } from '..';

/*
  This file is to allow you to develop and live reload the application while making changes.
  You can add any services you want to test if you are adding a new feature. You can see the
  output in the terminal so you can check if you have made any breaking changes.
*/

/*

  Services:

  'echoService' - Returns a plain string.
  'interServiceComsService' - Speaks to "echoService" and returns the result from the func "getInterServiceResponse".
  'storageService' - Saves the previous and current integer passed to it and returns the result.
  'instanceService' - Has more than one instance running and returns its instance ID.

  Express Servers:

  'Express Server 1' - HTTPS (Port: 12000)
  'Express Server 2' - HTTP (Port: 12001)

  Tests:

  1. Response from the "echoService" from a client HTTPS request via Express server 1.
    a) Append a header via the pre middleware
    b) Append a header via the post middleware
  2. Response from the "echoService" from a client HTTP request via Express server 2.
  3. Response from the "echoService" via a direct connection to the framework.
    a) Use the client version of Risen.JS
  4. Response from the "Express Server 1" returning a JSON in the public path of the framework.
  5. Response from the "Express Server 2" returning a JSON in the public path of the framework.
  6. Response from the "interServiceComsService" which speaks to another service before responding from a client HTTP request.
  7. Response from the "storageService" which checks that storage is working via a HTTP request.
  8. Response from the "instanceService" which checks that multiple instances are indeed running via a HTTP request.
  9. Append a header to all requests via httpOptions.middleware
  10. Check that "runOnStart" works with the service core.
  11. Check that "runOnStart" works with a micro service.
  12. Test all service core inbuilt functions.
  13. Test a custom service core function.
  14. Test logging to file works.
  15. Test existance of sqlLite file exists.

*/

/*
  Makes the script crash on unhandled rejections instead of silently
  ignoring them. In the future, promise rejections that are not handled will
  terminate the Node.js process with a non-zero exit code.
*/

process.on('unhandledRejection', (err) => {
  throw err;
});

// Define SSL variables
const sslOptions = {
  key: './__resources__/ssl/key.pem',
  cert: './__resources__/ssl/server.crt'
};

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
    }
  ]
};

// Define framework options
const frameworkOptions = {
  databaseNames: ['_defaultDatabase'],
  logPath: './tmp/dev/runtime.log',
  mode: 'server',
  http: [httpOptions],
  runOnStart: [],
  verbose: true
};

// Initialise instance
const RisenInstance = new Risen(frameworkOptions);

// Define a simple echo micro service
RisenInstance.defineService('devService', './tmp/dev/devService', {
  runOnStart: [],
  instances: 1
});

// Start the micro server
RisenInstance.startServer(async () => {
  const nodeArgs = [].concat('--max_old_space_size=5120');
  // Start the jest server and run the tests
  let jestProcess;
  try {
    jestProcess = await execa(
      'node',
      nodeArgs.concat(path.resolve(__dirname, `runTests.js`)),
      { stdio: 'inherit', reject: false }
    );
  } catch (e) {
    console.error(e);
  }
  // Check if the process exits you cancel this process too
  if (jestProcess.signal) {
    if (jestProcess.signal === 'SIGKILL') {
      console.warn(
        'The test process exited early, potentially the system ran out of memory or `kill -9` was called on the process.'
      );
    } else if (jestProcess.signal === 'SIGTERM') {
      console.warn(
        'The test process exited early, you may have called `kill` or `killall` or the system is shutting down.'
      );
    }
    process.exit(1);
  }
  process.exit(jestProcess.exitCode);
});
