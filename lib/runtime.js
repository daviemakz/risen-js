'use strict';

// EVENTS: unhandledRejection
process.on('unhandledRejection', (reason, p) =>
  console.log('ERROR - Unhandled Rejection Detected. MORE INFO: ', reason)
);

// EVENTS: rejectionHandled
process.on('rejectionHandled', (reason, p) =>
  console.log('ERROR - Rejection Handled Detected. MORE INFO: ', reason)
);

// EVENTS: SIGINT
process.on('SIGINT', function() {
  // Show Message
  console.log();
  console.log('CTRL + C Event Detected...');
  console.log('Script Will Exit...');
  // Exit...
  process.exit();
});
