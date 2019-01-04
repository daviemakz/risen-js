// EVENTS: SIGINT
process.on('SIGINT', () => {
  // Show message
  console.log();
  console.log('CTRL + C event detected...');
  console.log('Script will exit...');
  // Exit...
  process.exit();
});
