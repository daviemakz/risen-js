'use strict';

/* eslint-disable no-console */

process.on('SIGINT', () => {
  console.log();
  console.log('CTRL + C event detected...');
  console.log('Process will exit...');
  process.exit();
});
