'use strict';

/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

// Import NPM modules
import { run } from 'jest';

// Import system components
/* eslint-disable-next-line */
import jestConfigBase from '../../jest.config.js';

process.env.NODE_ENV = 'test';

// Wrapper to run the function programatically
const executeTests = (jestConfig, args) => {
  // Run the tests for the Risen.JS
  console.log(`Starting full test suite for Risen.JS....`);

  // For CLI arguments
  const argv = [];

  // Add config argument
  argv.push('--bail');
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
