'use strict';

// Load libs
const Listener = require('./listener');
const Speaker = require('./speaker');

// Export [createListener]
exports.createListener = function(address) {
  return new Listener(address);
};

// Export [createSpeaker]
exports.createSpeaker = function() {
  var addresses = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
  return new Speaker(addresses);
};
