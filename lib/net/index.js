'use strict';

// Load libs
const Listener = require('./listener');
const Speaker = require('./speaker');
const SpeakerReconnector = require('./speakerReconnector');

// Export [createListener]
exports.createListener = function(address) {
  return new Listener(address);
};

// Export [createSpeaker]
exports.createSpeaker = function() {
  const addresses = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
  return new Speaker(addresses);
};

// Export [createSpeaker]
exports.createSpeakerReconnector = function() {
  const addresses = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
  return new SpeakerReconnector(addresses);
};
