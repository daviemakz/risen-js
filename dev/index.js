'use strict';

/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import path from 'path';
import execa from 'execa';
import { Risen } from '..';

import { frameworkOptions } from './options';
import { LOG_PATH } from './constants';

process.on('unhandledRejection', (err) => {
  /*
    Makes the script crash on unhandled rejections instead of silently
    ignoring them. In the future, promise rejections that are not handled will
    terminate the Node.js process with a non-zero exit code.
  */
  throw err;
});

// Initialise instance
const RisenInstance = new Risen(frameworkOptions);

// Define the devServer
RisenInstance.defineService('devService', './tmp/dev/devService', {
  runOnStart: [],
  instances: 1
});

// Define the numbersService
RisenInstance.defineService('numbersService', './tmp/dev/numbersService', {
  runOnStart: [],
  instances: 4
});

// Define the storageService
RisenInstance.defineService('storageService', './tmp/dev/storageService', {
  runOnStart: [],
  instances: 1
});

// Define the instanceService
RisenInstance.defineService('instanceService', './tmp/dev/instanceService', {
  runOnStart: [],
  instances: 1
});

// Define the runOnStartService
RisenInstance.defineService(
  'runOnStartService',
  './tmp/dev/runOnStartService',
  {
    runOnStart: ['initialiseData'],
    instances: 1
  }
);

// Remove log file
if (fs.existsSync(`../${LOG_PATH}`)) {
  fs.unlinkSync(`../${LOG_PATH}`);
}

// Start the micro server
RisenInstance.startServer(async () => {
  const processArgs = Object.entries(require('minimist')(process.argv.slice(2)))
    .map(([cliParam, cliValue]) => {
      if (cliParam !== '_') {
        return cliValue ? `--${cliParam}=${cliValue}` : `--${cliParam}`;
      }
      return void 0;
    })
    .filter((arg) => arg);

  const nodeArgs = [].concat('--max_old_space_size=5120');
  // Start the jest server and run the tests
  let jestProcess;
  try {
    jestProcess = await execa(
      'node',
      nodeArgs.concat(path.resolve(__dirname, `runTests.js`), processArgs),
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

  console.log(`JEST exiting with code: ${jestProcess.exitCode}`);
  process.exit(jestProcess.exitCode);
});
