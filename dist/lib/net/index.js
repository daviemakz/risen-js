'use strict';

var _listener = _interopRequireDefault(require('./listener'));

var _speaker = _interopRequireDefault(require('./speaker'));

var _speakerReconnector = _interopRequireDefault(require('./speakerReconnector'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.createListener = function(address) {
  return new _listener.default(address);
};

exports.createSpeaker = function() {
  var addresses = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
  return new _speaker.default(addresses);
};

exports.createSpeakerReconnector = function() {
  var addresses = arguments.length >= 1 ? [].slice.call(arguments, 0) : [];
  return new _speakerReconnector.default(addresses);
};
