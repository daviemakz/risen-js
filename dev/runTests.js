'use strict';

/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

// Import NPM modules
import { run } from 'jest';

// Import system components
/* eslint-disable-next-line */
import jestConfigBase from '../../jest.config.js';

// Wrapper to run the function programatically
const executeTests = (jestConfig, args) => {
  // Run the tests for the Risen.JS
  console.log(`Starting full test suite for Risen.JS....`);

  // For CLI arguments
  const processArgs =
    Object.entries(require('minimist')(process.argv.slice(2)))
      .map(([cliParam, cliValue]) => {
        if (cliParam !== '_') {
          return cliValue ? `--${cliParam}=${cliValue}` : `--${cliParam}`;
        }
        return void 0;
      })
      .filter((arg) => arg) || [];

  const argv = [];

  // Add CLI arguments
  processArgs.forEach((arg) => {
    argv.push(arg);
  });

  // Add config argument
  argv.push('--no-coverage');
  argv.push('--config', JSON.stringify(jestConfig));
  argv.push(
    ...Object.entries(args).map(([cliParam, cliValue]) =>
      cliValue ? `--${cliParam}=${cliValue}` : `--${cliParam}`
    )
  );

  // Show parameters
  if (Object.prototype.hasOwnProperty.call(args, 'verbose')) {
    console.log(argv);
  }

  // Run JEST
  return run(argv).then(
    () => {
      console.log(
        `Completed test suite for Risen.JS, check JEST for test results!`
      );
    },
    (err) => {
      console.error(
        `Failed test suite for Risen.JS. An unexpected error has occurred!`
      );
      console.error(err);
    }
  );
};

executeTests(jestConfigBase, []);
