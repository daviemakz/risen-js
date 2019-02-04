'use strict';

// EVENTS: SIGINT
process.on('SIGINT', () => {
  // Show message
  console.log();
  console.log('CTRL + C event detected...');
  console.log('Process will exit...');
  // Exit...
  process.exit();
});
