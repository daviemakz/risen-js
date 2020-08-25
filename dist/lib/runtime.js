'use strict';

process.on('SIGINT', function () {
  console.log();
  console.log('CTRL + C event detected...');
  console.log('Process will exit...');
  process.exit();
});
